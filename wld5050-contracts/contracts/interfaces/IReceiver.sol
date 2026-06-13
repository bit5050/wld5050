// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IReceiver
/// @notice Chainlink CRE consumer contract interface
/// @dev Source: https://docs.chain.link/cre/guides/workflow/using-evm-client/onchain-write/building-consumer-contracts
/// @dev The CRE Forwarder calls onReport() after DON reaches consensus on the workflow output
interface IReceiver {
    /// @notice Called by the Chainlink KeystoneForwarder after DON consensus
    /// @param metadata  Encoded workflow metadata (workflowId, workflowName, reportId, etc.)
    /// @param report    ABI-encoded workflow output — decoded inside your implementation
    function onReport(bytes calldata metadata, bytes calldata report) external;
}
