// SPDX-License-Identifier: MIT licensed

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IBondlyBridgeHub.sol";
import "./interfaces/IDiscountManager.sol";
import "./Utils.sol";

contract BondlyBridgeChild is ERC1155, Ownable, ReentrancyGuard {
    uint256 public currencySymbol;

    /// @dev hub contract address
    address public immutable hubContract;

    uint256 internal tokenIdTracker;

    /// @dev token id => token name (cardano equivalent of token id)
    mapping(uint256 => bytes32) public tokenNames;

    /// @dev token id => token uri
    mapping(uint256 => string) internal _uri;

    receive() external payable {}

    /**
     * @dev constructor
     * @param hubContract_ hub contract address
     */
    constructor(address hubContract_) ERC1155("") Ownable() ReentrancyGuard() {
        hubContract = hubContract_;
    }

    /**
     * @dev Sets currency symbol
     * @param currencySymbol_ currency symbol
     */
    function setCurrencySymbol(uint256 currencySymbol_) external {
        require(msg.sender == hubContract, "BridgeChild: only hub contract");
        currencySymbol = currencySymbol_;
    }

    /**
     * @dev Returns foreign token
     * @param id token id
     * @param recipient cardano recipient address
     * @param amount amount
     */
    function returnForeignToken(
        uint256 id,
        string calldata recipient,
        uint256 amount,
        uint256 discountId
    ) external payable nonReentrant {
        require(
            balanceOf(msg.sender, id) >= amount,
            "BridgeChild: insufficient token balance of the caller"
        );
        require(
            Utils.validateCardanoAddr(recipient),
            "BridgeChild: invalid recipient"
        );

        IDiscountManager discountManager = IDiscountManager(
            IBondlyBridgeHub(hubContract).discountManager()
        );
        uint256 feeAmount = discountManager.feeAmount(msg.sender, discountId);

        require(msg.value == feeAmount, "BridgeChild: fee amount not match");
        (bool success, ) = payable(hubContract).call{value: feeAmount}(
            abi.encodeWithSignature(
                "returnForeignToken(uint256,string,uint256)",
                id,
                recipient,
                amount
            )
        );
        require(success, "BridgeChild: failed to pay fee");

        _burn(msg.sender, id, amount);
    }

    /**
     * @dev Mints token
     * @param recipient recipient address
     * @param amount mint amount
     * @param tokenName token name
     * @param tokenUri token uri
     * @return tokenId minted token id
     */
    function mintToken(
        address recipient,
        uint256 amount,
        bytes32 tokenName,
        string calldata tokenUri
    ) external returns (uint256 tokenId) {
        require(msg.sender == hubContract, "BridgeChild: only hub contract");

        tokenId = tokenIdTracker;

        _mint(recipient, tokenId, amount, "");

        tokenNames[tokenId] = tokenName;
        _uri[tokenId] = tokenUri;

        unchecked {
            tokenIdTracker += 1;
        }
    }

    /**
     * @dev Returns uri of token
     * @param tokenId token id
     * @return uri
     */
    function uri(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return _uri[tokenId];
    }

    /**
     * @dev called before token transfer
     */
    function _beforeTokenTransfer(
        address, /* operator */
        address from,
        address to,
        uint256[] memory, /* ids */
        uint256[] memory, /* amounts */
        bytes memory /* data */
    ) internal view override {
        require(
            from != hubContract && to != hubContract,
            "BridgeChild: cannot transfer to hub contract"
        );
    }
}
