// SPDX-License-Identifier: MIT licensed

pragma solidity 0.8.4;

interface IDiscountManager {
    function feeAmount(address user, uint256 id)
        external
        view
        returns (uint256 amount);

    function treasury() external view returns (address);
}
