// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IENSNameWrapper} from "../interfaces/IENS.sol";

contract MockNameWrapper is IENSNameWrapper {
    address public approvedOperator;
    string public lastLabel;
    address public lastOwner;

    function setApproved(address operator, bool) external {
        approvedOperator = operator;
    }

    function setSubnodeRecord(
        bytes32,
        string calldata label,
        address owner,
        address,
        uint64,
        uint32,
        uint64
    ) external returns (bytes32 node) {
        require(msg.sender == approvedOperator, "not approved");
        lastLabel = label;
        lastOwner = owner;
        return bytes32(0);
    }

    function ownerOf(uint256) external pure returns (address) {
        return address(0);
    }
}
