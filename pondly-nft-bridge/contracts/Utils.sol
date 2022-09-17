// SPDX-License-Identifier: MIT licensed

pragma solidity 0.8.4;

library Utils {
    function validateCardanoAddr(string memory addr)
        internal
        pure
        returns (bool)
    {
        return (startsWith(addr, "Ae2") || // byron icarus
            startsWith(addr, "DdzFF") || // byron daedalus
            startsWith(addr, "addr1")); // shelley
    }

    function startsWith(string memory str, string memory prefix)
        internal
        pure
        returns (bool)
    {
        bytes memory _str = bytes(str);
        bytes memory _prefix = bytes(prefix);
        uint256 len = _prefix.length;

        for (uint256 i = 0; i < len; i++) {
            if (_str[i] != _prefix[i]) {
                return false;
            }
        }

        return true;
    }
}
