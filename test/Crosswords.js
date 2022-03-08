// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Crosswords contract", function () {

    let Token, token
    let Crosswords, crosswords
    let owner;

    beforeEach(async function () {
        // deploy the token contract
        Token = await ethers.getContractFactory("MindJam")
        token = await Token.deploy()
        await token.deployed()

        // Get the ContractFactory and Signers here.
        Crosswords = await ethers.getContractFactory("Crosswords");
        [owner, s1, s2] = await ethers.getSigners();

        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.
        crosswords = await Crosswords.deploy(token.address);

        // We can interact with the contract by calling `hardhatToken.method()`
        await crosswords.deployed();
        crosswords = crosswords.connect(owner)
        crosswordsS1 = crosswords.connect(s1)
        tokenS1 = token.connect(s1)
    });

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {

        // If the callback function is async, Mocha will `await` it.
        it("Should set the right owner", async function () {

            expect(await crosswords.owner()).to.equal(owner.address);

        });

        it("Should set the right token address", async () => {
            expect(await crosswords.mjToken()).to.equal(token.address)
        })
    });

    describe("Create new crossword", () => {

        beforeEach(async () => {
            await crosswords.newCrossword(10, 15, 100)
        })

        it("Should have the right values", async () => {
            let firstCrossword = await crosswords.crosswords(0)

            expect(firstCrossword[0]).to.equal(10)
            expect(firstCrossword[1]).to.equal(15)
            expect(firstCrossword[2]).to.equal(100)
            console.log(`The whole crossword structure: ${firstCrossword}`)
        })

        // it("Should add them to the array", async () => {
        //     let index = crosswords.new
        // })
    })

    describe("Request hints", () => {
        beforeEach(async () => {
            let bigN = BigNumber.from(10).pow(19)
            await token.mint(s1.address, bigN)
        })

        it("Should not allow if no token allowance", async () => {
            await expect(crosswordsS1.requestWord(0)).to.be.reverted
        })

        it("Should not allow if not enough tokens allowed", async () => {

            // Allow for less than enough
            let notEnough = BigNumber.from(5).mul(BigNumber.from(10).pow(18))
            await tokenS1.approve(crosswords.address, notEnough)
            expect(await token.allowance(s1.address, crosswords.address)).to.equal(notEnough)

            // Check if tx gets reverted
            await expect(crosswordsS1.requestSquare(0)).to.be.reverted
            await expect(crosswordsS1.requestWord(0)).to.be.reverted

        })
    })
})