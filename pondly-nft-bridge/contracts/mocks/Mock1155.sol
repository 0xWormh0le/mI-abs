// SPDX-License-Identifier: MIT licensed

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Mock1155 is ERC1155 {
    constructor() ERC1155("") {}

    mapping(uint256 => string) internal _uri;

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        string calldata uri_
    ) external {
        _mint(to, id, amount, "");
        _uri[id] = uri_;
    }

    function uri(uint256 id) public view override returns (string memory) {
        return _uri[id];
    }
}
