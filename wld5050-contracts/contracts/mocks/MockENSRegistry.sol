// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IENSRegistry {
    function setSubnodeRecord(
        bytes32 node,
        bytes32 label,
        address owner,
        address resolver,
        uint64 ttl
    ) external;
}

contract MockENSRegistry is IENSRegistry {
    address public approvedOperator;
    string public lastLabel;
    address public lastOwner;

    function setApproved(address operator) external {
        approvedOperator = operator;
    }

    function setSubnodeRecord(
        bytes32,
        bytes32 label,
        address owner,
        address,
        uint64
    ) external {
        require(msg.sender == approvedOperator, "not approved");
        lastLabel = string(abi.encodePacked(label));
        lastOwner = owner;
    }
}
