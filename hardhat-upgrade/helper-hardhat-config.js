const networkConfig = {
  31337: {
    name: "localhost",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    initialOwner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  },
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    initialOwner: "0xF441AF52A287c8087b5e419d434cc75CA2560124",
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = { networkConfig, developmentChains, DECIMALS, INITIAL_ANSWER };
