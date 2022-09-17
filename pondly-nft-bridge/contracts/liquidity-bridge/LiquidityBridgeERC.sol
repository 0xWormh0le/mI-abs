// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { Util } from "./Util.sol";

/**
Liquidity Bridge deposit ERC20 contract
*/
contract LiquidityBridgeERC is ReentrancyGuard {
  using SafeERC20 for IERC20;

  // We use a mapping and a list to keep the validation step cheap, by making the setup more expensive.
  // New tokens will be added to the whitelist far less often than it is checked.
  // Also stores the expected destination address to void tokens to
  mapping(address => address) acceptedTokens;
  address[] public acceptedTokensKeys;
  address public owner;

  address immutable weth;

  uint256 public feeAmount;
  uint256 public feeAccrued;
  address public feeAddr;

  // Event for deposits
  event DepositERC(
    address indexed sender,
    string tokenName,
    address tokenAddress,
    uint256 amount,
    string cardanoAddress
  );

  event FeeConfigUpdated(address indexed user, uint256 feeAmount, address feeAddr);

  event FeeWithdrawn(address user, uint256 amount);

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  modifier onlyOwner() {
    require(msg.sender == owner, "Unauthorized");
    _;
  }

  constructor(address _weth, uint256 _feeAmount, address _feeAddr) {
    weth = _weth;
    owner = msg.sender;
    feeAmount = _feeAmount;
    feeAddr = _feeAddr;
  }

  function acceptedTokensKeysLength() external view returns (uint256) {
    return acceptedTokensKeys.length;
  }

  function voidAddress(address token) external view returns (address) {
    return acceptedTokens[token];
  }

  function isWhitelisted(address token) external view returns (bool) {
    return acceptedTokens[token] != address(0);
  }

  // Update internal dex whitelist mapping, via addresses to add and remove
  // Remove indexes must be reverse ordered
  function updateConfig(
    address[] calldata tokenAddresses,
    address[] calldata tokenDests,
    uint256[] calldata indexesToRemove
  ) external onlyOwner {

    for (uint256 i = 0; i < indexesToRemove.length; i++) {
      uint256 index = indexesToRemove[i];
      require(index < acceptedTokensKeys.length, "Index out of bounds");
      address token = acceptedTokensKeys[index];
      delete acceptedTokens[token];
      acceptedTokensKeys[index] = acceptedTokensKeys[acceptedTokensKeys.length - 1];
      acceptedTokensKeys.pop();
    }

    for (uint256 i = 0; i < tokenAddresses.length; i++) {
      address token = tokenAddresses[i];
      address tokenDest = tokenDests[i];

      require(tokenDest != address(0), "Dest token is zero address");

      acceptedTokens[token] = tokenDest;
      acceptedTokensKeys.push(token);
    }
  }

  // Internal deposit method for verify and emitting event
  function _deposit(address tokenERC, uint amount, string memory cardanoAddress) private {
    // Verify the cardano address is vaguely well formed
    require(Util.validateCardanoAddress(cardanoAddress), "Invalid cardano address");

    // Verify the token is whitelisted
    require(acceptedTokens[tokenERC] != address(0), "Token not whitelisted");
    
    require(amount > 0, "No tokens provided");

    emit DepositERC(
      msg.sender,
      IERC20Metadata(tokenERC).symbol(),
      tokenERC,
      amount,
      cardanoAddress
    );
  }

  // Direct eth deposits, casted internally to weth
  function depositEth(string calldata cardanoAddress) external payable nonReentrant {
    require(msg.value > feeAmount, "Invalid fee");

    uint256 depositAmount;

    unchecked {
      depositAmount = msg.value - feeAmount;
    }

    // Transfer eth to void
    (bool success, ) = payable(acceptedTokens[weth]).call{value: depositAmount}("");
    require(success, "Deposit eth failed");

    _deposit(weth, depositAmount, cardanoAddress);

    unchecked {
      feeAccrued += feeAmount;
    }
  }

  // Accepts given ERC20 contract
  function depositERC(address token, string calldata cardanoAddress) external payable nonReentrant {
    require(msg.value == feeAmount, "Invalid fee");

    IERC20 tokenERC = IERC20(token);
    // We will bridge the entire allowance we've been given
    uint256 amount = tokenERC.allowance(msg.sender, address(this));
    tokenERC.safeTransferFrom(msg.sender, acceptedTokens[token], amount);

    _deposit(token, amount, cardanoAddress);

    unchecked {
      feeAccrued += feeAmount;
    }
  }

  function updateFeeConfig(uint256 _feeAmount, address _feeAddr) external onlyOwner {
    feeAmount = _feeAmount;
    feeAddr = _feeAddr;
    emit FeeConfigUpdated(msg.sender, _feeAmount, _feeAddr);
  }

  function transferOwnership(address newOwner) external onlyOwner {
    require(newOwner != address(0), "New owner is zero address");
    address oldOwner = owner;


    if (newOwner != oldOwner) {
      owner = newOwner;
    }

    emit OwnershipTransferred(oldOwner, newOwner);
  }

  function withdrawFee() external nonReentrant {
    if (feeAccrued > 0) {
      uint256 amount = feeAccrued;
      feeAccrued = 0;
      (bool success, ) = payable(feeAddr).call{value: amount}("");
      require(success, "Withdraw failed");
      emit FeeWithdrawn(msg.sender, amount);
    }
  }
}
