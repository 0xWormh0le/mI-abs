// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./IUniswapV2Pair.sol";
import "./IUniswapV2Factory.sol";
import { Util } from "./Util.sol";

/**
Liquidity Bridge deposit contract
Ethereum UniSwapv2 factory address: 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
*/
contract LiquidityBridgeLP {
  IUniswapV2Factory factory;
  // We use a mapping and a list to keep the validation step cheap, by making the setup more expensive.
  // New tokens will be added to the whitelist far less often than it is checked.
  mapping(bytes32 => bool) cardanoDexes;
  bytes32[] cardanoDexesKeys;
  address owner;
  // Dead address to void tokens to
  address dead = address(0x000000000000000000000000000000000000dEaD);

  // Event thrown when a successful deposit occurs, including liquidity withdrawl
  event DepositLP(
    address indexed sender,
    bytes32 dexName,
    string token0,
    string token1,
    address addr0,
    address addr1,
    uint256 amount0,
    uint256 amount1,
    string cardanoAddress
  );

  // Specify the UniSwapV2 or SushiSwap factory address
  // We may later change this to a centralise auth system where we can add factories in future dynamically
  constructor(IUniswapV2Factory _factory, bytes32[] memory _cardanoDexes) {
    factory = _factory;
    // Set up mapping
    for(uint i = 0; i < _cardanoDexes.length; i++)
      cardanoDexes[_cardanoDexes[i]] = true;
    // Store keys
    cardanoDexesKeys = _cardanoDexes;
    owner = msg.sender;
  }

  // Checks an LP token is a pair belonging to the factory
  function validatePair(IUniswapV2Pair pair) internal view returns (address, address) {
    address token0 = pair.token0();
    address token1 = pair.token1();
    assert(factory.getPair(token0, token1) == address(pair));
    return (token0, token1);
  }

  // Ensures a given dexName is within the `cardanoDexes` list. 
  function validateDexName(bytes32 dexName) internal view {
    require(cardanoDexes[dexName], "Invalid dex");
  }

  // Update internal whitelist mapping
  function updateConfig(bytes32[] memory _cardanoDexes) public {
    require(msg.sender == owner || tx.origin == owner, "Unauthorized");
    // Clear the original keys
    for(uint i = 0; i < cardanoDexesKeys.length; i++)
      cardanoDexes[cardanoDexesKeys[i]] = false;
    // Set up new mapping
    for(uint i = 0; i < _cardanoDexes.length; i++)
      cardanoDexes[_cardanoDexes[i]] = true;
    // Store new keys
    cardanoDexesKeys = _cardanoDexes;
  }

  // Deposit all allowed tokens of a pair to a cardano address
  // Authenticates the pair, withdraws all the LP tokens and voids the result
  // Lastly, calls the event
  function depositLP(IUniswapV2Pair pair, bytes32 dexName, string memory cardanoAddress) public {
    // Validation
    require(Util.validateCardanoAddress(cardanoAddress), "Invalid cardano address");
    (address token0, address token1) = validatePair(pair);
    validateDexName(dexName);

    // Get everything they'll give us
    uint256 amount = pair.allowance(msg.sender, address(this));
    require(amount > 0, "No tokens provided");

    pair.transferFrom(msg.sender, address(pair), amount); // Transfer it all to the pair
    (uint amount0, uint amount1) = pair.burn(dead); // Burn the liquidity tokens and void the underlying erc20s

    // Emit the event with given data
    emit DepositLP(
      msg.sender,
      dexName,
      IERC20Metadata(token0).symbol(),
      IERC20Metadata(token1).symbol(),
      token0,
      token1,
      amount0,
      amount1,
      cardanoAddress
    );
  }
}
