// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IENSNameWrapper
/// @notice ENS NameWrapper interface for minting winner subnames
/// @dev Source: https://docs.ens.domains/wrapper/contracts/
/// @dev WLD5050 uses this to mint winner-round{N}.wld5050.eth after every settlement
interface IENSNameWrapper {
    /// @notice Create a subname and assign it to an owner
    /// @param parentNode  namehash("wld5050.eth")
    /// @param label       e.g. "winner-round42" — the subname label before the dot
    /// @param owner       Winner's address — receives the subname NFT
    /// @param resolver    ENS Public Resolver address
    /// @param ttl         Time to live (0 = default)
    /// @param fuses       Permission fuses — use 0 for unrestricted subname
    /// @param expiry      0 = inherits parent expiry (permanent for our use case)
    function setSubnodeRecord(
        bytes32 parentNode,
        string calldata label,
        address owner,
        address resolver,
        uint64  ttl,
        uint32  fuses,
        uint64  expiry
    ) external returns (bytes32 node);

    /// @notice Check current owner of a wrapped name
    function ownerOf(uint256 id) external view returns (address);
}

/// @title IENSReverseRegistrar  
/// @notice Allows setting reverse records so addresses resolve to ENS names
interface IENSReverseRegistrar {
    function setName(string calldata name) external returns (bytes32);
    function setNameForAddr(
        address addr,
        address owner,
        address resolver,
        string calldata name
    ) external returns (bytes32);
}

/// @title IENSResolver
/// @notice ENS Public Resolver — set text records on agent.wld5050.eth
interface IENSResolver {
    function setText(bytes32 node, string calldata key, string calldata value) external;
    function setAddr(bytes32 node, address addr) external;
    function addr(bytes32 node) external view returns (address);
}
