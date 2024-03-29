const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {
  storeImages,
  storeTokenUriMetadata,
} = require("../utils/UploadToPinata");

const imagesLocation = "./images/randomNft";

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
};

const FUND_AMOUNT = "1000000000000000000000"

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let tokenUris;

  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris();
  }

  let vrfCoordinatorV2Address, subscriptionId, initialOwner;

  if (developmentChains.includes(network.name)) {
    initialOwner = networkConfig[chainId].initialOwner;
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = await vrfCoordinatorV2Mock.getAddress();

    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait(1);
    // console.log(txReceipt.logs[0].args.subId);
    subscriptionId = txReceipt.logs[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    initialOwner = networkConfig[chainId].initialOwner;
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }
  log("----------------------------------------------------");
  const args = [
    initialOwner,
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].mintFee,
    networkConfig[chainId].callbackGasLimit,
    tokenUris,
  ];

  const randomIpfsNft = await deploy("RandomIpfsNft", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
})
  log("----------------------------------------------------");

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(randomIpfsNft.address, args);
  }
};

async function handleTokenUris() {
  tokenUris = [];
  const { responses: imageUploadResponses, files } = await storeImages(
    imagesLocation
  );
  for (const index in imageUploadResponses) {
    let tokenUriMetadata = { ...metadataTemplate };
    tokenUriMetadata.name = files[index].replace(".png", "");
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[index].IpfsHash}`;

    console.log(`Uploading ${tokenUriMetadata.name}...`);

    const metadataUploadResponse = await storeTokenUriMetadata(
      tokenUriMetadata
    );
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }

  console.log("Token URIs Uploaded");
  console.log(tokenUris);
  return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];
