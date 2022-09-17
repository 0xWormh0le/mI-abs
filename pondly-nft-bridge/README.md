
![CI](https://github.com/mlabs-haskell/Bondly-NFTBridge-Ethereum/actions/workflows/main.yml/badge.svg)


# Ethereum Contract Specification

This document outlines the various contracts required to be implemented on Ethereum in Solidity.
Following is a short high level description of the contracts:
- Deposit/hub contract
  - Handles the deposits of Ethereum native ERC721 or 1155 tokens, and collect fee via [discount manager](./docs/discount-manager.md)
  - Verifies proof of claims issued by the centralised server, ensuring said claim cannot be redeemed twice
  - Handles the release of the above on return trips via proof of claim
  - Deploys/refers to child ERC1155 contracts for Cardano native token transfers by order of the centralised server via a proof of claim
  - Maintains and verifies the collection whitelist, allowing an authorised user to update it
  - Emits events on native and non-native deposits
- Child ERC1155 contract
  - This contract is deployed by the hub contract with a determinstic address derived from the CurrencySymbol of the equivalent Cardano tokens it represents
  - Mints a Cardano native NFT by order of the hub contract.
  - Burns a cardano native NFT by order of the holder, forwarding to the hub contract to emit its deposit event.
  - Holds relevant metadata set by the hub contract upon deployment

## Prelim
### Cardano Addresses
This document regularly refers to Cardano full addresses.
These addresses can take many forms - see [here](https://iohk.zendesk.com/hc/en-us/articles/900005403563-Cardano-address-types)
We need to support Byron and Shelly era addresses, and should perform verification onchain up to a point at which it significantly affects fees.
Primarily, represented as regex patterns
- Shelly era: `^addr1[qvw][023456789acdefghjklmnpqrstuvwxyz]{52}(?:[023456789acdefghjklmnpqrstuvwxyz]{45})?$`
- Byron-icarus: Further research required - see [here](https://cips.cardano.org/cips/cip19/)
- Byron-daedalus: Further research required - see above

### Discount Manager
Please refer to doc [here](./docs/discount-manager.md)

### Authority
This document will refer to the authority of this contract as the owner/admin interchangably, this may be a single person, or - via a admin-like interface, a group of authoritised wallets

## Deposit/Hub contract - BondlyBridgeHubContract
### Purpose
- Escrow for native asset bridges
- Allow claim of native assets given valid proof
- Allow deposit of native asset given within whitelist
- Defer to and deploy `BondlyBridgeChildContract`s
- Event hub for bridge

### Inherits
- `ERC1155TokenReceiver`
- `ERC721TokenReceiver`
- Further interfaces may be used for ownable, upgradable, etc.

### Events

#### `NativeTokenDeposited`
```haskell
{ sender: address -- where the token is transferred from
, depositIdTracker: uint256
, token: address
, tokenId: uint256
, amount: uint256
, recipient: string -- Cardano full address
}
```

#### `SendNativeToken`
```haskell
{ recipient: string -- Cardano full address
, tokenAddress: address
, tokenName: bytes32
, tokenId: int256
, quantity: uint256
, tokenMetaURI: string
}
```

#### `ReturnForeignToken`
```haskell
{ recipient: string -- Cardano full address
, currencySymbol: uint256
, tokenId: int256
, tokenName: bytes32
, quantity: uint256
}
```

#### `Claim`
```haskell
{ recipient: address
, token: address
, tokenId: uint256
, value: uint256
}
```

### State
- `bytes32 whitelistMerkleHash`
- `address owner`
- `address discountManager`
- `uint256 feeBalance`
- `uint256 depositIdTracker`
- `address childImpl`
- `mapping(uint256 => SendNativeTokenInfo) sendNativeTokenInfo`
- `mapping(bytes32 => bool) proofClaims`
- `address proofSigner`

### Methods
#### `constructor(bytes32 whitelistHash, address discountManager)`
- Sets the merkle tree root to the hash given
- Sets the contract owner/admin to the deployer of the contract
- Sets the discount manager

#### `_sendNativeToken(address _sender, address _token, uint256 _tokenId, uint256 _value, bytes _data)`
This function will be called when user transfers his token to the hub, and keeps bridge data of the token transferred in `sendNativeTokenInfo` state which will be used by subsequent `sendNativeToken`, where the payment is made via discount manager.
- We assume the `_token` here cannot be an instance of our Child ERC1155 contract, by explicitly restricting transfers to here.
- `_token` will refer to an ERC1155 or ERC721 contract. Which specifically matters only for reading fields.
- `_data` must hold the recipient cardano address (verify well formed), as well as the merkle proof of `_token`'s presence in the whitelist
  The structure of `_data` is like the following
    - First byte of `_data` is the length of the merkle proof - named `n`.
    - Following is `n` `bytes32`s for the merkle proof.
    - Following this, until the end of the bytes list, is the cardano address as a string.
- `_token` must be present in the whitelist, by computing the root hash from `_token` and the merkle proof above and comparing it to the merkle tree root hash stored in the contract.
- Verify the cardano address from `_data` is well formed.
- Emits the `NativeTokenDeposited` event, whose args will be used to call `sendNativeToken` function with.

#### `onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4)`
- Call `sendNativeToken(msg.sender, _id, _value, _data)`
- Following convention of ERC recievers, must return hash of given method. See documentation of `ERC1155TokenReceiver` for details.
- This function ensures `_sendNativeToken` is called when ERC1155 token is transferred to the hub.

#### `onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external returns(bytes4)`
- Must always fail

#### `onERC721Received(address _operator, address _from, uint256 _id, bytes calldata _data) external returns(bytes4)`
- Call `sendNativeToken(msg.sender, _id, 1, _data)`
- Following convention of ERC recievers, must return hash of given method. See documentation of `ERC721TokenReceiver` for details.
- This function ensures `_sendNativeToken` is called when ERC721 token is transferred to the hub.

#### `sendNativeToken(uint256 depositId, uint256 discountId) external payable`
It gets bridge data for sending native token using `depositId` from previously stored data (`sendNativeTokenInfo`) by `_sendNativeToken`, and handles with discounted payment specified by `discountId`.
- Tx will be reverted if
  - discount specified by `discountId` does not meet condition
  - fee amount in ether sent to the function mismatches with the amount calculated from discount manager
  - `depositId` is invalid, which means token is not transferred for the bridge transfer
  - ether transfer to treasury address of discount manager fails
- Increase fee balance by fee amount
- emits `SendNativeToken` event
- Removes deposit id data to prevent from double invocation

#### `claimNativeToken(address recipient, address token, uint256 tokenId, uint256 amount, bytes32 proofKey, bytes32 proof)`
- How to generate proof and verify?
  - A centralized bot will generate proof based on proof key and data that will be passed to this function. Proof key is a random 32 bytes data which is made unique to distinguish proof. Hence, 
  - `claimNativeToken()` will recover the bot's pk from the args, proof and proofKey.
  - It compares the recovered bot's pk with the one defined as its state
  - If it matches, it update `proofClaims` so the proof value won't be used again in the future

```Node
// pseudo code to generate proof
function bot.getProof(funcArg) {
  // func arg is recipient, token, tokenId, amount
  const proofKey = random 32 bytes
  const data = keccak256(abi.encodePacked(funcArg, proofKey))
  return (sign(data, bot's private key), proofKey)
}

// pseudo code to verify proof
mapping(bytes32 => bool) proofClaims;
bytes20 immutable public proofSigner; // initialized in constructor

function claimNativeToken(
  sometype funcArg,
  bytes32 proofKey,
  bytes32 proof
) external {
  require(!proofClaims[proofKey], "already claimed");
  require(
    ecrecover( // recover bot's private key that was used to generate proof
      keccak256(abi.encodePacked(funcArg, proofKey)), // merge all these values to make a single bytes array
      r, s, v from proof
    ) == proofSigner,
    "proof verification failed"
  );
  proofClaims[proofKey] = true;
  ...
}
```

- Given the above proof verifies, this function will:
  - If `token` is an instance of an ERC721 contract, require `value` is 1
  - transfer `value` of asset defined by `token` and `id` to `recipient`
  - Emits the `Claim` event

#### `claimForeignToken(address _recipient, uint256 currencySymbol, bytes32 tokenName, string tokenURI, uint256 value, bytes32 proofKey, bytes32 proof)`
- **NOTE: ☝ Please refer to the above function for proof generation and verification.**
- Given the above proof verifies, this function will:
  - Precalculate the child ERC1155 contract address using `CREATE2` opcode, determined only by the `currencySymbol`
  - If above contract is not already deployed, deploy the contract - giving all required data - see `constructor` for Child ERC1155 contract.
  - Call the `mintToken` function on this contract, with relevant data.
  - Emits the `Claim` event

#### `returnForeignToken(BondlyBridgeChildContract childContract, string recipient, uint256 id, uint256 value) payable`
- Inspect `childContract` for its `currencySymbol`
- Verify the address of `childContract` matches what would be deployed using the above currencySymbol with `CREATE2`
- Increase fee balance by ethers sent from child's `returnForeignToken()` function
- Emits the `ReturnForeignToken` event with correct fields

#### `updateTreeHash(bytes32 whitelistHash) external`
- Must be called by the contract admin/owner
- Updates the whitelist merkle tree root with the new hash

#### `withdrawBalance() external`
- Withdraw ethers to treasury address of discount manager
- Confirm return value to check if fee was successfully withdrawn
- Implement [checks-effects-interactions](https://docs.soliditylang.org/en/v0.8.13/security-considerations.html#use-the-checks-effects-interactions-pattern) pattern to prevent re-entrancy attack


## Child ERC1155 contract - BondlyBridgeChildContract
### Purpose
- Allows us to keep deterministic address of tokens based on their currency symbol from Cardano
- Allows return bridge of minted tokens by burning and deferring to hub contract
- Hold required metadata
- Otherwise standard ERC1155 contract

### Inherits
- `ERC1155`
- `ERC1155Metadata_URI`
- Any required extensions of the above

### Events
This contract emits no events.

### State
- `uint256 currencySymbol`
- `address hubContract`
- `mapping(uint256 => bytes32) tokenNames`
- `mapping(uint256 => string) internal _uri`

### Methods
#### `constructor(uint256 _currencySymbol, address _hubContract)`
- Store `currencySymbol` and `hubContract`

### `returnForeignToken(uint256 id, string recipient, uint256 amount, uint256 discountId) external payable`
- Verify that the calling address holds the given token id, with the amount provided
- Verify the recipient cardano address is well formed
- Verify ether sent matches with the value calculated from discount manager
- Burn the given tokens
- Call `hubContract.returnForeignToken` with correct fields and ethers sent

### `mintToken(address recipient, uint256 id, uint256 value, bytes32 tokenName, string tokenURI)`
- Must be called by `hubContract` only
- Mint and transfer `value` of token `id` to `recipient`
- Set up the `tokenURI` for this token
- Set the `tokenName` for this token

### `function tokenName(uint256 _id) external view returns (byte32)`
- Reads from `tokenNames`, similarly to `uri`

### All transfer methods
- MUST prevent any transfers to or from `hubContract` by overriding `ERC1155._beforeTokenTransfer`.

### Eth transfers
- Reject
