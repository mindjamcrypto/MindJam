const hre = require("hardhat")
require("dotenv").config()
let tokenAddress = "0x65AD5cad49e9278b327aA2B09B7614733211996e"

async function main() {
    const Crosswords = await hre.ethers.getContractFactory("Crosswords")
    const crosswords = await Crosswords.deploy(tokenAddress)
    await crosswords.deployed()
    console.log(`Contract deployed at ${crosswords.address}`)
}


main()
    .then(() => {
        process.exit(0)
    })
    .catch(e => {
        console.log(e)
        process.exit(0)
    })