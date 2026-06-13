// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IWorldID
/// @notice Interface for the WorldIDRouter on World Chain
/// @dev Source: https://docs.world.org/world-id/idkit/onchain-verification
interface IWorldID {
    /// @notice Verify a World ID ZK proof of personhood
    /// @param root        The Merkle root of the identity tree (from IDKit widget)
    /// @param groupId     1 = Orb-verified humans only (required for sybil resistance)
    /// @param signalHash  keccak256(abi.encodePacked(signal)).hashToField()
    /// @param nullifierHash Unique per (human, action) — store to prevent reuse
    /// @param externalNullifierHash  Scopes the proof: hash(appId + actionId)
    /// @param proof       The ZK proof — uint256[8] array unpacked from IDKit output
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view;
}
