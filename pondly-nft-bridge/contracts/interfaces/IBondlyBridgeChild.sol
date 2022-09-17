// SPDX-License-Identifier: MIT licensed

pragma solidity 0.8.4;

interface IBondlyBridgeChild {
    function setCurrencySymbol(uint256 currencySymbol_) external;

    function mintToken(
        address recipient,
        uint256 amount,
        bytes32 tokenName,
        string calldata tokenUri
    ) external returns (uint256);

    function currencySymbol() external view returns (uint256);

    function tokenNames(uint256 tokenId) external view returns (bytes32);

    function uri(uint256 tokenId) external view returns (string memory);
}
