// // src/services/blockchainService.js
// const { ethers } = require('ethers');
// const { chainWsUrl, contractAddress, chainRpcUrl } = require('../config');
// const contractABI = require('../../contracts/MedicalAccessControl.json');

// let provider, contract;
// let rpcUrl = chainWsUrl || chainRpcUrl;

// function initBlockchain() {
//     provider = new ethers.WebSocketProvider(rpcUrl);
//     //   provider = new ethers.providers.WebSocketProvider(chainWsUrl);
//   // For sending transactions, you can use a service wallet (not ideal for production)
//   const signer = new ethers.Wallet(process.env.SERVICE_PRIVATE_KEY, provider);
//   contract = new ethers.Contract(contractAddress, contractABI, signer);
//   return contract;
// }

// function getContract() {
//   if (!contract) initBlockchain();
//   return contract;
// }

// async function updateRecordCID(patientAddress, newCID) {
//   const contract = getContract();
//   // Note: In production, ideally the patient should sign this transaction.
//   const tx = await contract.updateRecord(newCID);
//   await tx.wait();
//   return tx.hash;
// }

// async function requestAccess(patientAddress, doctorAddress) {
//   const contract = getContract();
//   const tx = await contract.requestAccess(patientAddress);
//   await tx.wait();
//   return tx.hash;
// }

// async function grantAccess(patientAddress, doctorAddress) {
//   const contract = getContract();
//   const tx = await contract.grantAccess(doctorAddress);
//   await tx.wait();
//   return tx.hash;
// }

// module.exports = { updateRecordCID, requestAccess, grantAccess, getContract };

// src/services/blockchainService.js

// src/services/blockchainService.js
const { ethers } = require('ethers');
const { chainRpcUrl, contractAddress } = require('../config'); 
// remove references to chainWsUrl

// If your artifact has 'abi'
const contractArtifact = require('../../contracts/MedicalAccessControl.json');
const contractABI = contractArtifact.abi;

let provider;
let contract;

function initBlockchain() {
  // Instead of new ethers.WebSocketProvider(...)
  // use JSON RPC (HTTP) provider:
  provider = new ethers.JsonRpcProvider(chainRpcUrl);

  // create a signer from your private key
  const signer = new ethers.Wallet(process.env.SERVICE_PRIVATE_KEY, provider);

  // create the contract instance with the ABI array
  contract = new ethers.Contract(contractAddress, contractABI, signer);

  return contract;
}

function getContract() {
  if (!contract) {
    initBlockchain();
  }
  return contract;
}

// Example contract calls:
async function updateRecordCID(patientAddress, newCID) {
  const contract = getContract();
  const tx = await contract.updateRecord(newCID);
  await tx.wait();
  return tx.hash;
}

async function requestAccess(patientAddress, doctorAddress) {
  const contract = getContract();
  const tx = await contract.requestAccess(patientAddress);
  await tx.wait();
  return tx.hash;
}

async function grantAccess(patientAddress, doctorAddress) {
  const contract = getContract();
  const tx = await contract.grantAccess(doctorAddress);
  await tx.wait();
  return tx.hash;
}

module.exports = {
  updateRecordCID,
  requestAccess,
  grantAccess,
  getContract
};
