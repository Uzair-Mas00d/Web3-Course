import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { networkConfig } from "../helper-hardhat-config";

const deployBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  //@ts-ignore
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying Box...");

  const box = await deploy("Box", {
    from: deployer,
    args: [networkConfig[31337].initialOwner],
    log: true,
  });
  const timeLock = await ethers.getContract("TimeLock", deployer);
  const boxContract = await ethers.getContractAt("Box", box.address);
  const transferOwnerTx = await boxContract.transferOwnership(
    await timeLock.getAddress()
  );
  await transferOwnerTx.wait(1);
  log("Box deployed!");
};

export default deployBox;
