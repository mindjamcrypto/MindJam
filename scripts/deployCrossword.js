const hre = require("hardhat")
const ethers = hre.ethers


async function main() {
    // Deploy token
    const Token = await ethers.getContractFactory("MindJam")
    const token = await Token.deploy()
    await token.deployed()
    console.log("Token contract deployed at ", token.address)

    // Deploy Crosswords
    const Crosswords = await ethers.getContractFactory("Crosswords")
    const crosswords = await Crosswords.deploy(token.address)
    await crosswords.deployed()
    console.log("Crosswords contract deployed at ", crosswords.address)
}


main()
    .then(() => {
        process.exit(0)
    })
    .catch(e => {
        console.log(e)
        process.exit(0)
    })