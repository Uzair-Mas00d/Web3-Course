const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  log("-----------------------------------------");

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log:true,
    waitConfirmations: network.config.blockConfirmations,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      viaAdminContract: {
        name: "BoxProxyAdmin",
        args:[networkConfig[chainId].initialOwner],
        artifact: "BoxProxyAdmin",
      },
    },
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(box.address, []);
  }
};
