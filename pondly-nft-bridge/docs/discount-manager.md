# Discount Manager Overview
This document is intended to give a chain agnostic overview of the behaviours and responsibilities of the Discount Managers.

There are some differences between the two versions of this protocol (Ethereum/Cardano). Ethereum will implement all features, Cardano will implement a subset.
This subset is defined within the `discount-endpoint-spec.md` document.

## 1. Description of product
The discount manager is intended to be a fee payment service with the support of discount opportunities based on ownership of configurable tokens.
The manager should be used in conjuction with another contract as its fee payment system.
Discounts within the manager are defined as potential percentage discounts on the flat fee given caller's ownership of tokens. Note, these tokens (often called discount tokens) are NOT consumed by use of the discount. They are intended to be Utility tokens (usually non/semi-fungible), and as such, provide their utility as a perk of ownership.
Any given discount includes one or more discount tokens, each with an associated amount required for eligability to the discount.


## 2. Architecture

### Events

```Solidity
event DiscountAdded(uint256 id);

event DiscountRemoved(uint256 id);

event TreasuryUpdated(address treasury);

event FlatFeeUpdated(uint256 flatFee);
```

### Data types
```Solidity
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
```

### States

```Solidity
/// @dev 1e6 means 100% percent
uint256 constant BASE_PERCENTAGE = 1e6;

/// @dev discount ID => detail
mapping(uint256 => Discount) discounts;

/// @dev flat fee amount in ether
uint256 flatFee;

/// @dev where all fee payments will be sent to
address treasury;

/// @dev proposal id tracker
uint256 idTracker;
```

## 3. General responsibilities
The manager must handle the following workflows:
- 2.1 Deployment with admin.
- 2.2 Configuration of fee.
- 2.3 Configuration of discount opportunities, defined by a required tokens, required amount of said tokens, validity timeframe, and discount percentage (up to and including 100%).
- 2.4 Payment of fees:
  - 2.4.1 Without discount, paying flat fee.
  - 2.4.2 With given discount.
- 2.5 Query available discounts.

### 3.1 Deployment
- Admin is selected upon deployment.
- Admin must be changable - use typical admin interface.
- Also defines starting treasury.

### 3.2 Fee treasury
```Solidity
function updateTreasuryAddress(address treasury_) external onlyOwner
```
- Admin must be able to change the fee treasury address, where all fee payments must be sent.
- Emits `TreasuryUpdated` event.

```Solidity
function updateFlatFee(uint256 flatFee_) external onlyOwner
```

- Admin must be able to change the fee flat amount, in Eth
- Emits `FlatFeeUpdated` event.

### 3.3 Configuration of discount opportunities
- Admin must be able to Add and Remove discount opportunities, defined by stateful counting ID within the contract.

#### Adding
```Solidity
function addDiscount(
  address[] calldata tokens,
  uint256[] calldata tokenAmounts,
  uint256[] calldata tokenIds,
  uint256 percentage,
  uint256 startTime,
  uint256 endTime
) onlyOwner
```
  - Admin provides:
    - Discount tokens definition, as a list of: ERC20 contract address, ERC721 contract address + tokenId, ERC1155 contract address + tokenId.
    - Discount token amounts, as a list of 18dp amount of the above contracts respectively.
    - Discount proportion, as a percentage of the flat fee, stored to 6dp (1_000_000 as an integer represents a 100% discount, no fee required).
    - Discount timeframe, a start and end time of the discounts validity.
  - We create a new unique ID (`idTracker`) for this opportunity, store in the contract in `Discount` struct.
  - Emits `DiscountAdded` event.

#### Removing
```Solidity
function removeDiscount(uint256 id) onlyOwner
```
  - Admin provides an ID, discount for this ID is removed.
  - Emits `DiscountRemoved` event.

### 3.4 Payment of fee
- Intended to be called by the bridge, allows payment of fee. Optionally takes which discount ID to apply.
- If the user is not eligible for the discount for some reason like invalid timeframe or insufficient token balance, it will revert with appropriate error.

```Solidity
function feeAmount(address user, uint256 id) view returns (uint256 amount)
```

#### 3.4.1 Flat fee payment
- User does not provide a discount ID.
- Eth required is taken from them and transferred to the treasury.
#### 3.4.2 Discount fee payment
- User provides a discount ID.
- Verify ownership of the correct amount of the discount tokens associated to the discount ID.
- Flat fee with discount proportion subtracted is taken from the user and transferred to the treasury.

### 3.5 Discount query
```Solidity
function getAllDiscounts(address user) view (Discount[] memory list)
```
- Our frontend must be able to query all discounts, and verify which can be applied.
- This means, it must be possible to either (both in a view fashion):
  - (over several queries) pull the entire discount list from the chain.
  - query only valid discounts, by iterating the discounts and checking validity of each against the user.
    (Note, validity here refers to a given users ability to use this discount as of call time. This should verify token ownership and validity time interval)
- The above MUST be pure and called offchain before the fee payment transaction, to reduce fees. Pure computation need not be executed by every node.
