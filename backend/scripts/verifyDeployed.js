// scripts/verifyDeployed.js
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xf955c98Bd8eB9FA6DCf5A15d77c81f2b6841f819";
  const MedicalAccessControl = await ethers.getContractFactory("MedicalAccessControl");
  const contract = await MedicalAccessControl.attach(contractAddress);

  // For example, read the public mapping for some test address
  const cid = await contract.latestRecordCID("0x0000000000000000000000000000000000000000");
  console.log("CID for 0x00... is:", cid); // Should be blank if not updated
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
