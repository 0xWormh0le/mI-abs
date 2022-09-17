// SPDX-License-Identifier: MIT licensed

pragma solidity 0.8.4;

interface IBondlyBridgeHub {
    function discountManager() external view returns (address);

    function returnForeignToken(
        uint256 id,
        string calldata recipient,
        uint256 value
    ) external payable;
}
