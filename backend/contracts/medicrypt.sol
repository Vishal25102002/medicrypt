// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalAccessControl {
    // Mapping from patient address to the latest IPFS CID for their record.
    mapping(address => string) public latestRecordCID;

    // Events that log record updates and access control actions.
    event RecordUpdated(address indexed patient, string newCID);
    event AccessRequested(address indexed patient, address indexed doctor, uint256 timestamp);
    event AccessGranted(address indexed patient, address indexed doctor, uint256 timestamp);

    // Called by the patient to update their record pointer (CID from IPFS).
    function updateRecord(string calldata newCID) external {
        latestRecordCID[msg.sender] = newCID;
        emit RecordUpdated(msg.sender, newCID);
    }

    // Called by a doctor to request access to a patient's record.
    function requestAccess(address patient) external {
        emit AccessRequested(patient, msg.sender, block.timestamp);
    }

    // Called by the patient to grant access to a doctor.
    function grantAccess(address doctor) external {
        emit AccessGranted(msg.sender, doctor, block.timestamp);
    }
}
