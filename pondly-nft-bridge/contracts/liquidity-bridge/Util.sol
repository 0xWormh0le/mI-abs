// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library Util {

  // Minimal safety check for cardano address
  // Address specifications can be found here: https://cips.cardano.org/cips/cip19/
  // TODO - discuss how indepth this should be
  //   do we check it starts with addr1q, addr1v or addr1w
  //   do we ensure lowercase alphanumeric (excluding b,i,o and 1 (except for addr1))
  function validateCardanoAddress(string memory cardanoAddress) internal pure returns (bool) {
    bytes memory addressBytes = bytes(cardanoAddress);
    // No substrings in solidity, and a generic solution would cost extra gas
    bool startsWithAddr = addressBytes[0] == "a" && addressBytes[1] == "d" && addressBytes[2] == "d" && addressBytes[3] == "r";
    // Shorthand is payment only, longhand is payment + staking
    return startsWithAddr && (addressBytes.length == 58 || addressBytes.length == 103);
  }
}