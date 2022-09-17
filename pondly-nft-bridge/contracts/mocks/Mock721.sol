// SPDX-License-Identifier: MIT licensed

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Mock721 is ERC721URIStorage {
    constructor() ERC721("Mock721", "Mock721") {}

    function mint(
        address to,
        uint256 id,
        string calldata uri
    ) external {
        _mint(to, id);
        _setTokenURI(id, uri);
    }
}
