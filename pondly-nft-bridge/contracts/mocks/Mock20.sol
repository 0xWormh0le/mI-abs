// SPDX-License-Identifier: MIT licensed

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Mock20 is ERC20 {
    constructor() ERC20("Mock20", "Mock20") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
