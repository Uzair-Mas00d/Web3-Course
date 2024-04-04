const {ethers} = require("hardhat")

async function main (){
    const boxProxyContract = await ethers.getContract("BoxProxyAdmin")
    const transparentProxy = await ethers.getContract("Box_Proxy")
    const boxv2 = await ethers.getContract("BoxV2")

    const proxyBoxV1 = await ethers.getContractAt("Box", await transparentProxy.getAddress())
    const versionV1 = await proxyBoxV1.version()
    console.log(versionV1);

    const upgradeTx = await boxProxyContract.upgrade(await transparentProxy.getAddress(), await boxv2.getAddress())
    await upgradeTx.wait(1)

    const proxyBoxV2 = await ethers.getContractAt("BoxV2", await transparentProxy.getAddress())
    const versionV2 = await proxyBoxV2.version()
    console.log(versionV2);
}

main()
.then(() => process.exit(0))
.catch((error)=> {
    console.error(error)
    process.exit(1)
})