// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

interface IENSRegistry {
    function setSubnodeRecord(
        bytes32 node,
        bytes32 label,
        address owner,
        address resolver,
        uint64 ttl
    ) external;
}

/// @title WinnerEnsClaimRegistrar
/// @notice Lets verified raffle winners claim winner-round{N}.wld5050.eth on Ethereum L1.
/// @dev Parent wld5050.eth owner must call ens.setApprovalForAll(registrar, true) once.
///      Works with unwrapped .eth names (no NameWrapper required).
contract WinnerEnsClaimRegistrar is EIP712 {
    bytes32 public constant CLAIM_TYPEHASH = keccak256(
        "Claim(uint256 raffleId,string label,address winner,uint256 deadline)"
    );

    IENSRegistry public immutable ens;
    address public immutable claimSigner;
    bytes32 public immutable parentNode;
    address public immutable resolver;

    mapping(uint256 => bool) public claimed;

    event WinnerBadgeClaimed(uint256 indexed raffleId, address indexed winner, string label);

    error AlreadyClaimed();
    error SignatureExpired();
    error InvalidSignature();

    constructor(
        address ens_,
        address claimSigner_,
        bytes32 parentNode_,
        address resolver_
    ) EIP712("WLD5050 Winner ENS", "1") {
        ens = IENSRegistry(ens_);
        claimSigner = claimSigner_;
        parentNode = parentNode_;
        resolver = resolver_;
    }

    /// @notice Mint winner-round{N}.wld5050.eth to msg.sender after backend signature verification.
    function claim(
        uint256 raffleId,
        string calldata label,
        uint256 deadline,
        bytes calldata signature
    ) external {
        if (claimed[raffleId]) revert AlreadyClaimed();
        if (block.timestamp > deadline) revert SignatureExpired();

        bytes32 structHash = keccak256(
            abi.encode(
                CLAIM_TYPEHASH,
                raffleId,
                keccak256(bytes(label)),
                msg.sender,
                deadline
            )
        );

        address recovered = ECDSA.recover(_hashTypedDataV4(structHash), signature);
        if (recovered != claimSigner) revert InvalidSignature();

        claimed[raffleId] = true;

        ens.setSubnodeRecord(
            parentNode,
            keccak256(bytes(label)),
            msg.sender,
            resolver,
            0
        );

        emit WinnerBadgeClaimed(raffleId, msg.sender, label);
    }
}
