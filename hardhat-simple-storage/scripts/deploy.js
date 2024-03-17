const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract....");

  const SimpleStorage = await SimpleStorageFactory.deploy();
  await SimpleStorage.waitForDeployment();
  const storageAddress = await SimpleStorage.getAddress()
  console.log(`Deployed Contract to ${storageAddress}`);
  // console.log(network.config);
  if(network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY){
    await verify(storageAddress, [])
  }

  const currentValue = await SimpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  const transcationResponse = await SimpleStorage.store(7)
  await transcationResponse.wait(1)
  const updtedValue = await SimpleStorage.retrieve()
  console.log(`Update Value is: ${updtedValue}`);

}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
