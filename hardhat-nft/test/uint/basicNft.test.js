const { assert } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic Nft Unit Tests", function () {
      let basicNft, deployer;

      beforeEach(async function () {
        // const account = await ethers.getSigners();
        // deployer = account[0];
        await deployments.fixture(["basicnft"]);
        deployer = (await getNamedAccounts()).deployer;
        basicNft = await ethers.getContract("BasicNft", deployer);
      });

      describe("Constructor", function () {
        it("Initializes the NFT Correctly.", async function () {
          const name = await basicNft.name();
          const symbol = await basicNft.symbol();
          const tokenCounter = await basicNft.getTokenCounter();

          assert.equal(name, "Dogie");
          assert.equal(symbol, "DOG");
          assert.equal(tokenCounter.toString(), "0");
        });
      });

      describe("Mint NFT", function () {
        beforeEach(async function () {
          const txResponse = await basicNft.mintNft();
          await txResponse.wait(1);
        })

        it("Allows users to mint an NFT, and updates appropriately", async function () {
          const tokenURI = await basicNft.tokenURI(0);
          const tokenCounter = await basicNft.getTokenCounter();

          assert.equal(tokenCounter.toString(), "1");
          assert.equal(tokenURI, await basicNft.TOKEN_URI());
        })

        it("Show the correct balance and owner of an NFT", async function () {
          const deployerAddress = deployer;
          const deployerBalance = await basicNft.balanceOf(deployerAddress);
          const owner = await basicNft.ownerOf("0");

          assert.equal(deployerBalance.toString(), "1");
          assert.equal(owner, deployerAddress);
        })

      })

    });
