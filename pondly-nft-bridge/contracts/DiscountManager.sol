// SPDX-License-Identifier: MIT licensed

pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IDiscountManager.sol";

contract DiscountManager is IDiscountManager, Ownable {
    using ERC165Checker for address;

    enum ErrorCode {
        OK,
        // validity & revert code
        ID_NOT_DEFINED,
        OUT_OF_TIMEFRAME,
        INSUFFICIENT_TOKEN_BALANCE,
        INVALID_TOKEN_TYPE,
        // revert code
        PERCENTAGE_OUT_OF_LIMIT,
        TOKEN_LENGTH_MISMATCH,
        INVALID_TOKEN_LENGTH,
        ZERO_ADDRESS
    }

    error DiscountManagerError(ErrorCode code);

    struct Discount {
        /// @dev discount token and token amount: fee payer needs to have `tokenAmount` of `token` to choose the discount ID
        address[] tokens;
        /// @dev meaningful when token is ERC20 and 1155
        uint256[] tokenAmounts;
        /// @dev meaningful when token is ERC721 and 1155
        uint256[] tokenIds;
        /// @dev discount percentage
        uint256 percentage;
        /// @dev start and end time when the discount ID is valid during
        uint256 startTime;
        uint256 endTime;
    }

    /// @dev 1e6 means 100% percent
    uint256 internal constant BASE_PERCENTAGE = 1e6;

    /// @dev discount ID => detail
    mapping(uint256 => Discount) public discounts;

    /// @dev flat fee amount in ether
    uint256 public flatFee;

    /// @dev where all fee payments will be sent to
    address public override treasury;

    /// @dev proposal id tracker
    uint256 internal idTracker;

    event DiscountAdded(uint256 id);

    event DiscountRemoved(uint256 id);

    event TreasuryUpdated(address treasury);

    event FlatFeeUpdated(uint256 flatFee);

    constructor(address treasury_, uint256 flatFee_) Ownable() {
        treasury = treasury_;
        flatFee = flatFee_;
        idTracker = 1;
    }

    function addDiscount(
        address[] calldata tokens,
        uint256[] calldata tokenAmounts,
        uint256[] calldata tokenIds,
        uint256 percentage,
        uint256 startTime,
        uint256 endTime
    ) external onlyOwner {
        if (tokens.length == 0) {
            revert DiscountManagerError(ErrorCode.INVALID_TOKEN_LENGTH);
        }

        if (
            tokens.length != tokenAmounts.length ||
            tokens.length != tokenIds.length
        ) {
            revert DiscountManagerError(ErrorCode.TOKEN_LENGTH_MISMATCH);
        }

        if (percentage > BASE_PERCENTAGE) {
            revert DiscountManagerError(ErrorCode.PERCENTAGE_OUT_OF_LIMIT);
        }

        Discount storage discount = discounts[idTracker];

        discount.tokens = tokens;
        discount.tokenAmounts = tokenAmounts;
        discount.tokenIds = tokenIds;

        if (percentage > 0) {
            discount.percentage = percentage;
        }

        if (startTime > 0) {
            discount.startTime = startTime;
        }

        if (endTime > 0) {
            discount.endTime = endTime;
        } else {
            discount.endTime = type(uint256).max;
        }

        uint256 tracker = idTracker;

        unchecked {
            idTracker += 1;
        }

        emit DiscountAdded(tracker);
    }

    function removeDiscount(uint256 id) external onlyOwner {
        Discount storage discount = discounts[id];

        if (discount.tokens.length == 0) {
            revert DiscountManagerError(ErrorCode.ID_NOT_DEFINED);
        }

        delete discount.tokens;

        emit DiscountRemoved(id);
    }

    function updateTreasuryAddress(address treasury_) external onlyOwner {
        if (treasury_ == address(0)) {
            revert DiscountManagerError(ErrorCode.ZERO_ADDRESS);
        }

        treasury = treasury_;
        emit TreasuryUpdated(treasury);
    }

    function updateFlatFee(uint256 flatFee_) external onlyOwner {
        flatFee = flatFee_;
        emit FlatFeeUpdated(flatFee);
    }

    function getDiscount(uint256 id) external view returns (Discount memory) {
        Discount storage discount = discounts[id];

        if (discount.tokens.length == 0) {
            revert DiscountManagerError(ErrorCode.ID_NOT_DEFINED);
        }

        return discounts[id];
    }

    function feeAmount(address user, uint256 id)
        external
        view
        override
        returns (uint256 amount)
    {
        amount = flatFee;

        if (id > 0) {
            Discount storage discount = discounts[id];

            if (discount.tokens.length == 0) {
                revert DiscountManagerError(ErrorCode.ID_NOT_DEFINED);
            }

            ErrorCode code = _valid(discount, user);

            if (code != ErrorCode.OK) {
                revert DiscountManagerError(code);
            }

            amount -= (flatFee * discount.percentage) / BASE_PERCENTAGE;
        }
    }

    function _valid(Discount storage discount, address user)
        internal
        view
        returns (ErrorCode)
    {
        if (
            block.timestamp < discount.startTime ||
            block.timestamp > discount.endTime
        ) {
            return ErrorCode.OUT_OF_TIMEFRAME;
        } else {
            address[] storage tokens = discount.tokens;

            for (uint256 i = 0; i < tokens.length; i++) {
                address token = tokens[i];

                if (token.supportsInterface(type(IERC721).interfaceId)) {
                    bytes memory data = abi.encodeWithSelector(
                        IERC721(token).ownerOf.selector,
                        discount.tokenIds[i]
                    );

                    (bool success, bytes memory result) = token.staticcall{
                        gas: 30000
                    }(data);

                    if (!success || abi.decode(result, (address)) != user) {
                        return ErrorCode.INSUFFICIENT_TOKEN_BALANCE;
                    }
                } else if (
                    token.supportsInterface(type(IERC1155).interfaceId)
                ) {
                    if (
                        IERC1155(token).balanceOf(user, discount.tokenIds[i]) <
                        discount.tokenAmounts[i]
                    ) {
                        return ErrorCode.INSUFFICIENT_TOKEN_BALANCE;
                    }
                } else if (
                    IERC20(token).balanceOf(user) < discount.tokenAmounts[i]
                ) {
                    return ErrorCode.INSUFFICIENT_TOKEN_BALANCE;
                }
            }
        }

        return ErrorCode.OK;
    }

    function getAllDiscounts(address user)
        external
        view
        returns (Discount[] memory list, ErrorCode[] memory validity)
    {
        uint256 length;

        for (uint256 i = 0; i < idTracker; i++) {
            if (discounts[i].tokens.length > 0) {
                length += 1;
            }
        }

        list = new Discount[](length);
        validity = new ErrorCode[](length);
        uint256 k;

        if (length > 0) {
            for (uint256 i = 0; i < idTracker; i++) {
                Discount storage discount = discounts[i];

                if (discount.tokens.length > 0) {
                    list[k] = discount;
                    if (user == address(0)) {
                        validity[k] = ErrorCode.OK;
                    } else {
                        validity[k] = _valid(discount, user);
                    }

                    k += 1;
                }
            }
        }
    }
}
