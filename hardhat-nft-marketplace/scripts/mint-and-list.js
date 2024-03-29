const{ ethers } = require('hardhat');

const PRICE = ethers.parseEther('0.1');

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const basicNft = await ethers.getContract("BasicNft");

    console.log("Minting...");
    const mintTx = await basicNft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.logs[0].args.tokenId;

    console.log("Approving Nft...");
    const approvalTx = await basicNft.approve(await nftMarketplace.getAddress(), tokenId);
    await approvalTx.wait(1);

    console.log("Listing Nft...");
    const tx = await nftMarketplace.listItem(await basicNft.getAddress(), tokenId, PRICE);
    await tx.wait(1);
    console.log("Listed!");
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
