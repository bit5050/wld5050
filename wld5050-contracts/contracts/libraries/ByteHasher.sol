// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ByteHasher
/// @notice Helper for hashing bytes to a field element for World ID proof verification
/// @dev Source: https://github.com/worldcoin/world-id-onchain-template
library ByteHasher {
    /// @notice Hash bytes to a uint256 field element
    /// @dev Used to compute signalHash and externalNullifierHash for verifyProof()
    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }
}
