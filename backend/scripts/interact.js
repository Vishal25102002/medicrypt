// scripts/interact.js
const { ethers } = require("ethers");
require("dotenv").config();

// Configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // e.g., "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
const CHAIN_RPC_URL = process.env.CHAIN_RPC_URL; // e.g., "http://127.0.0.1:8545" for local Hardhat network
const contractABI = require("../contracts/MedicalAccessControl.json");

// Initialize provider and signer
const provider = new ethers.providers.JsonRpcProvider(CHAIN_RPC_URL);
async function main() {
  const [signer] = await provider.listAccounts();
  
  // Alternatively, get signer from ethers if using a service wallet:
  const wallet = provider.getSigner(); // Uses the first account by default on local network
  
  // Attach to the deployed contract using its address and ABI
  const MedicalAccessControl = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

  console.log("Interacting with contract at", CONTRACT_ADDRESS);
  
  // Example: Reading the current record pointer (CID) for a patient address
  const patientAddress = "0xYourPatientAddressHere"; // Replace accordingly
  const cid = await MedicalAccessControl.latestRecordCID(patientAddress);
  console.log("Latest CID for patient:", cid);

  // Example: Updating the record pointer (simulate patient updating record)
  console.log("Updating record pointer...");
  const tx = await MedicalAccessControl.updateRecord("QmUpdatedCIDExample");
  await tx.wait();
  console.log("Update transaction hash:", tx.hash);

  // Retrieve and log updated value
  const updatedCID = await MedicalAccessControl.latestRecordCID(patientAddress);
  console.log("Updated CID for patient:", updatedCID);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error interacting with contract:", error);
    process.exit(1);
  });

  