const networkConfig = {
  "31337": {
    name: "localhost",
    initialOwner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  },
 "11155111": {
    name: "sepolia",
    initialOwner: "0xF441AF52A287c8087b5e419d434cc75CA2560124",
  },
};

const MIN_DELAY = 3600;
const VOTING_PERIOD = 5;
const VOTING_DELAY = 1;
const QUORUM_PERCENTAGE = 4;
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const NEW_STORE_VALUE = 77;
const FUNC = "store";
const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the Box";
const developmentChains = ["hardhat", "localhost"];
const proposalsFile = "proposals.json";

export {
  networkConfig,
  MIN_DELAY,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  ADDRESS_ZERO,
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  proposalsFile
};
