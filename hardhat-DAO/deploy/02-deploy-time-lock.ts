import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MIN_DELAY, networkConfig } from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
    // @ts-ignore
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying Time Lock...");

  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args:[MIN_DELAY,[],[], networkConfig[31337].initialOwner],
    log: true,
  })
};

export default deployTimeLock;
