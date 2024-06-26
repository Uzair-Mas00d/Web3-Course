const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NftMarketplace Unit Tests", function () {
      let nftMarketplace, basicNft, deployer, player;
      const PRICE = ethers.parseEther("0.1");
      const TOKEN_ID = 0;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        const accounts = await ethers.getSigners();
        player = accounts[1];
        await deployments.fixture(["all"]);
        nftMarketplace = await ethers.getContract("NftMarketplace");
        // nftMarketplace = nftMarketplace.connect(player);
        basicNft = await ethers.getContract("BasicNft");
        await basicNft.mintNft();
        await basicNft.approve(await nftMarketplace.getAddress(), TOKEN_ID);
      })

      it("lists and can be bought", async () => {
        await nftMarketplace.listItem(await basicNft.getAddress(), TOKEN_ID, PRICE);
        const playerConnectedNftMarketplace = await nftMarketplace.connect(player);
        await playerConnectedNftMarketplace.buyItem(await basicNft.getAddress(), TOKEN_ID, { value: PRICE });

        const newOwner = await basicNft.ownerOf(TOKEN_ID);
        const deployerProceeds = await nftMarketplace.getProceeds(deployer);

        assert(newOwner.toString() === player.address);
        assert(deployerProceeds.toString() === PRICE.toString());
      })
    });
