require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers")
require("solidity-coverage");
require("hardhat-gas-reporter");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: {
  //   compilers: [
  //     {
  //       version: "0.8.8",
  //     },
  //     {
  //       version: "0.6.6",
  //     },
  //   ],
  // },
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  etherscan:{
    apiKey:process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled:true,
    outputFile:"gas-report.txt",
    noColors:true,
    currency:"USD",
    coinmarketcap:process.env.COINMARKETCAP_API_KEY,
    token:"ETH",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
