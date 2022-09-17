// SPDX-License-Identifier: MIT licensed

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IBondlyBridgeChild.sol";
import "./interfaces/IDiscountManager.sol";
import "./interfaces/IBondlyBridgeHub.sol";
import "./Utils.sol";

contract BondlyBridgeHub is
    IBondlyBridgeHub,
    IERC721Receiver,
    IERC1155Receiver,
    Ownable,
    ReentrancyGuard
{
    struct SendNativeTokenInfo {
        address token;
        uint256 tokenId;
        uint256 amount;
        string recipient;
    }

    using Address for address;

    using Clones for address;

    using ERC165Checker for address;

    /// @dev merkle proof that whitelists token
    bytes32 public whitelistMerkleHash;

    /// @dev child contract seed
    address public childImpl;

    uint256 public depositIdTracker;

    uint256 public feeBalance;

    address public immutable override discountManager;

    address public immutable proofSigner;

    /// @dev proof key => claimed
    mapping(bytes32 => bool) public proofClaims;

    /// @dev deposit id => send native token info
    mapping(uint256 => SendNativeTokenInfo) public sendNativeTokenInfo;

    event NativeTokenDeposited(
        address indexed from,
        uint256 indexed depositIdTracker,
        address indexed token,
        uint256 tokenId,
        uint256 amount,
        string recipient
    );

    event SendNativeToken(
        string indexed recipient,
        address indexed tokenAddress,
        string tokenName,
        uint256 tokenId,
        uint256 amount,
        string tokenMetaURI
    );

    event Claim(
        address indexed recipient,
        address indexed token,
        uint256 tokenId,
        uint256 amount
    );

    event ReturnForeignToken(
        string indexed recipient,
        uint256 indexed currencySymbol,
        uint256 tokenId,
        bytes32 tokenName,
        uint256 amount
    );

    event FeeWithdrawn(address user, uint256 amount);

    receive() external payable {}

    /**
     * @dev constructor
     * @param whitelistMerkleHash_ merkle proof of white listed tokens
     * @param discountManager_ discount manager contract address
     * @param proofSigner_ claim proof signer (bot) address
     */
    constructor(
        bytes32 whitelistMerkleHash_,
        address discountManager_,
        address proofSigner_
    ) Ownable() ReentrancyGuard() {
        whitelistMerkleHash = whitelistMerkleHash_;
        discountManager = discountManager_;
        proofSigner = proofSigner_;
    }

    /**
     * @dev Sets child implementation contract
     * @param childImpl_ child implemenation address
     */
    function setChildImplementation(address childImpl_) external onlyOwner {
        childImpl = childImpl_;
    }

    /**
     * @dev Accepts a whitelisted Ethereum-origin token and emits an event.
     *      The token will then be stored by the contract.
     *      This function is followed by `sendNativeToken`
     * @param sender token sender addresss
     * @param token token address
     * @param tokenId token id
     * @param amount token amount
     * @param data bytes consists of
     *        merkle leaf length - 1 byte
     *        merkle leaf array
     *        cardano recipient address
     */
    function _sendNativeToken(
        address sender,
        address token,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) internal {
        uint256 proofLen = uint8(data[0]);
        bytes32[] memory proof = new bytes32[](proofLen);
        uint256 recipientStart = 1 + proofLen * 32;
        bytes memory recipientBytes = new bytes(data.length - recipientStart);

        // first 32 bytes of data is length of bytes, hence starting from 1, not 0
        for (uint256 i = 1; i <= proofLen; i++) {
            assembly {
                let pos := add(add(data, 1), mul(32, i))
                let p := mload(pos)
                mstore(add(proof, mul(32, i)), p)
            }
        }

        for (uint256 i = 0; i < recipientBytes.length; i++) {
            recipientBytes[i] = data[i + recipientStart];
        }

        _keepSendNativeTokenInfo(
            sender,
            token,
            tokenId,
            amount,
            proof,
            string(recipientBytes)
        );
    }

    function _keepSendNativeTokenInfo(
        address sender,
        address token,
        uint256 tokenId,
        uint256 amount,
        bytes32[] memory proof,
        string memory recipient
    ) internal {
        require(
            MerkleProof.processProof(
                proof,
                keccak256(abi.encodePacked(token))
            ) == whitelistMerkleHash,
            "Bondly: token not whitelisted"
        );
        require(
            Utils.validateCardanoAddr(recipient),
            "Bondly: invalid recipient addr"
        );

        sendNativeTokenInfo[depositIdTracker] = SendNativeTokenInfo(
            token,
            tokenId,
            amount,
            recipient
        );

        emit NativeTokenDeposited(
            sender,
            depositIdTracker,
            token,
            tokenId,
            amount,
            recipient
        );

        unchecked {
            depositIdTracker += 1;
        }
    }

    /**
     * @dev Emits SendNativeToken event after receiving payment specified by discount id
     * @param depositId deposit id
     * @param discountId discount id
     */
    function sendNativeToken(uint256 depositId, uint256 discountId)
        external
        payable
    {
        SendNativeTokenInfo storage info = sendNativeTokenInfo[depositId];

        require(info.token != address(0), "Bondly: invalid deposit id");

        IDiscountManager manager = IDiscountManager(discountManager);
        uint256 feeAmount = manager.feeAmount(msg.sender, discountId);

        require(msg.value == feeAmount, "Bondly: fee amount not match");

        if (feeAmount > 0) {
            unchecked {
                feeBalance += feeAmount;
            }
        }

        if (info.token.supportsInterface(type(IERC721).interfaceId)) {
            emit SendNativeToken(
                info.recipient,
                info.token,
                IERC721Metadata(info.token).name(),
                info.tokenId,
                1,
                IERC721Metadata(info.token).tokenURI(info.tokenId)
            );
        } else if (info.token.supportsInterface(type(IERC1155).interfaceId)) {
            emit SendNativeToken(
                info.recipient,
                info.token,
                "",
                info.tokenId,
                info.amount,
                IERC1155MetadataURI(info.token).uri(info.tokenId)
            );
        } else {
            revert("Bondly: invalid token type");
        }

        delete info.token;
    }

    /**
     * @dev ERC1155 receiver
     */
    function onERC1155Received(
        address, /* operator */
        address from,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external override returns (bytes4) {
        _sendNativeToken(from, msg.sender, id, amount, data);
        return IERC1155Receiver.onERC1155Received.selector;
    }

    /**
     * @dev ERC1155 batch receiver
     */
    function onERC1155BatchReceived(
        address, /* operator */
        address, /* from */
        uint256[] calldata, /* ids */
        uint256[] calldata, /* values */
        bytes calldata /* data */
    ) external pure override returns (bytes4) {
        revert("Bondly: batch deposit not allowed");
    }

    /**
     * @dev ERC721 receiver
     */
    function onERC721Received(
        address, /* operator */
        address from,
        uint256 id,
        bytes calldata data
    ) external override returns (bytes4) {
        _sendNativeToken(from, msg.sender, id, 1, data);
        return IERC721Receiver.onERC721Received.selector;
    }

    /**
     * @dev Releases a previously locked Ethereum-origin token on return from Cardano.
     * @param recipient recipient address
     * @param token token address
     * @param tokenId token id
     * @param amount amount
     * @param proofKey proof key
     * @param proof claim proof signature
     */
    function claimNativeToken(
        address recipient,
        address token,
        uint256 tokenId,
        uint256 amount,
        bytes32 proofKey,
        bytes calldata proof
    ) external nonReentrant {
        require(!proofClaims[proofKey], "Bondly: already claimed");
        require(
            ECDSA.recover(
                keccak256(
                    abi.encodePacked(
                        recipient,
                        token,
                        tokenId,
                        amount,
                        proofKey
                    )
                ),
                proof
            ) == proofSigner,
            "Bondly: failed to verify proof"
        );

        proofClaims[proofKey] = true;

        if (token.supportsInterface(type(IERC721).interfaceId)) {
            require(amount == 1, "Bondly: invalid amount");
            IERC721(token).safeTransferFrom(address(this), recipient, tokenId);
        } else if (token.supportsInterface(type(IERC1155).interfaceId)) {
            IERC1155(token).safeTransferFrom(
                address(this),
                recipient,
                tokenId,
                amount,
                ""
            );
        } else {
            revert("Bondly: invalid token type");
        }

        emit Claim(recipient, token, tokenId, amount);
    }

    /**
     * @dev Claims foreign token
     * @param recipient recipient
     * @param currencySymbol currency symbol
     * @param tokenName token name
     * @param tokenUri token
     * @param amount amount
     * @param proofKey proof key
     * @param proof claim proof signature
     */
    function claimForeignToken(
        address recipient,
        uint256 currencySymbol,
        bytes32 tokenName,
        string calldata tokenUri,
        uint256 amount,
        bytes32 proofKey,
        bytes calldata proof
    ) external nonReentrant {
        require(!proofClaims[proofKey], "Bondly: already claimed");
        require(
            ECDSA.recover(
                keccak256(
                    abi.encodePacked(
                        recipient,
                        currencySymbol,
                        tokenName,
                        tokenUri,
                        amount,
                        proofKey
                    )
                ),
                proof
            ) == proofSigner,
            "Bondly: failed to verify proof"
        );

        proofClaims[proofKey] = true;

        address child = childImpl.predictDeterministicAddress(
            bytes32(currencySymbol)
        );

        if (!child.isContract()) {
            child = childImpl.cloneDeterministic(bytes32(currencySymbol));
            IBondlyBridgeChild(child).setCurrencySymbol(currencySymbol);
        }

        uint256 tokenId = IBondlyBridgeChild(child).mintToken(
            recipient,
            amount,
            tokenName,
            tokenUri
        );

        emit Claim(recipient, child, tokenId, amount);
    }

    /**
     * @dev Returns foreign token
     * @param tokenId token id
     * @param recipient cardano recipient address
     * @param amount amount
     */
    function returnForeignToken(
        uint256 tokenId,
        string calldata recipient,
        uint256 amount
    ) external payable override {
        IBondlyBridgeChild child = IBondlyBridgeChild(msg.sender);
        uint256 currencySymbol = child.currencySymbol();

        require(
            childImpl.predictDeterministicAddress(bytes32(currencySymbol)) ==
                msg.sender,
            "BridgeHub: invalid caller"
        );

        if (msg.value > 0) {
            unchecked {
                feeBalance += msg.value;
            }
        }

        emit ReturnForeignToken(
            recipient,
            currencySymbol,
            tokenId,
            child.tokenNames(tokenId),
            amount
        );
    }

    /**
     * @dev Updates merkle proof whitelisting tokens
     * @param whitelistHash new proof
     */
    function updateTreeHash(bytes32 whitelistHash) external onlyOwner {
        require(whitelistHash != bytes32(0), "Bondly: invalid hash");
        whitelistMerkleHash = whitelistHash;
    }

    /**
     * @dev Withdraws fee to treasury address of discount manager
     */
    function withdrawFee() external {
        uint256 _fee = feeBalance;

        if (feeBalance > 0) {
            feeBalance = 0;

            (bool success, ) = payable(
                IDiscountManager(discountManager).treasury()
            ).call{value: _fee}("");

            require(success, "Bondly: failed to pay fee");
        }

        emit FeeWithdrawn(msg.sender, _fee);
    }

    /**
     * @dev ERC165 implementation
     */
    function supportsInterface(bytes4 interfaceId)
        external
        pure
        override
        returns (bool)
    {
        return (interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC721Receiver).interfaceId ||
            interfaceId == type(IERC1155Receiver).interfaceId);
    }
}
