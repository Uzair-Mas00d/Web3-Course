const {ethers} = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
    const encryptJsonKey = wallet.encryptSync(process.env.PRIVATE_KEY_PASSWORD,process.env.PRIVATE_KEY)
    console.log(encryptJsonKey);
    fs.writeFileSync('./.enctyptKey.json', encryptJsonKey)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

