const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts })  {
    const { deployer } = await getNamedAccounts()

    const basicNft = await ethers.getContract("BasicNft", deployer)
    const basicMintTx = await basicNft.mintNft()
    await basicMintTx.wait(1)
    console.log("Basic NFT index 0 has tokenURI:",await basicNft.tokenURI(0));

    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomIpfsNft.getMintFee()

    await new Promise(async (resolve, reject) => {
        setTimeout(resolve, 300000)
        randomIpfsNft.once("NftMinted", async () => { 
            resolve()
        })
        const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() })
        const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1)
        if(developmentChains.includes(network.name)){
            const requestId = randomIpfsNftMintTxReceipt.logs[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, await randomIpfsNft.getAddress())
        }
    })
    console.log("Random IPFS NFT index 0 has tokenURI:", await randomIpfsNft.tokenURI(0));

    
    const highValue = ethers.parseEther("4000")
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNFT(highValue.toString())
    await dynamicSvgNftMintTx.wait(1)
    console.log("Dynamic SVG NFT index 0 has tokenURI:", await dynamicSvgNft.tokenURI(0));

}

module.exports.tags = ["all", "mint"]