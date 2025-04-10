async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MedicalAccessControl = await ethers.getContractFactory("MedicalAccessControl");
  const contract = await MedicalAccessControl.deploy();

  // Wait for the deployment to complete
  await contract.waitForDeployment();
  
  // Retrieve the deployed contract address using getAddress()
  const deployedAddress = await contract.getAddress();
  console.log("MedicalAccessControl deployed to:", deployedAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
