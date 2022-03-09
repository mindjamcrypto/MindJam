const { ethers } = require("hardhat")
const { BigNumber } = require("ethers")
const { expect } = require("chai")
const fs = require("fs")

const crosswordsAddress = "0x565Cd30539508CF67D1F01747423D30306C3dE27"
const crosswordsAbi = JSON.parse(fs.readFileSync("artifacts/contracts/Crosswords.sol/Crosswords.json")).abi
const crosswords = new ethers.Contract(crosswordsAddress, crosswordsAbi, ethers.provider)
const tokenAddress = "0xc3ad465d7353E522F932E14fEb62d00329FBD28E"
const tokenAbi = JSON.parse(fs.readFileSync("artifacts/contracts/MindJam.sol/MindJam.json")).abi
const token = new ethers.Contract(tokenAddress, tokenAbi, ethers.provider)


// Utility function to not have to deal with decimals
function toEth(n) {
    return ethers.utils.parseEther(n.toString())
}

describe("Crosswords and token contract on Mumbai testnet", () => {
    let owner, s1
    before(async () => {
        [owner, s1] = await ethers.getSigners()
        crosswordsOwner = crosswords.connect(owner)
        crosswordsS1 = crosswords.connect(s1)
        tokenOwner = token.connect(owner)
    })

    it("Should have the right owners", async () => {
        expect(await crosswords.owner()).to.equal(owner.address)
        expect(await token.owner()).to.equal(owner.address)
    })

    describe("Crosswords handling", () => {

        it("There should be at least one game", async () => {
            await crosswords.crosswords(0)
                .catch(async (e) => {
                    await expect(crosswordsOwner.newCrossword(10, 15, 100)).to.not.be.reverted
                    console.log("Created new crossword at index 0")
                })
        })

        it("Should allow to add new sessions", async () => {
            //     await expect(crosswordsOwner.endSession(0, 10, owner.address)).to.not.be.reverted
        })

        it("Should not allow an index out of bound or time = 0", async () => {
            //     await expect(crosswordsOwner.endSession(10, 10, owner.address)).to.be.reverted
            //     await expect(crosswordsOwner.endSession(0, 0, owner.address)).to.be.reverted
        })
    })

    describe("Hint requests", () => {

        before(async () => {
            // If the owner has less than 25 tokens, mint him some
            if ((await token.balanceOf(owner.address)).lt(toEth(25))) {
                await tokenOwner.mint(owner.address, toEth(100))
            }
        })

        it("Shouldn't allow to request hints if not enough allowance", async () => {
            // Make sure there's no allowance for S1 spending
            if ((await token.allowance(s1.address, crosswords.address)).gt(0)) {
                await tokenS1.approve(crosswords.address, 0)
                console.log("Revoked approve for S1 spending")
            }
            await expect(crosswordsS1.requestWord(0)).to.be.reverted
        })

        it("Shouldn't allow if the requestor doesn't have enough tokens", async () => {
            expect(parseInt(ethers.utils.formatEther(await token.balanceOf(s1.address))))
                .to.be.lessThan(10)

            await expect(crosswordsS1.requestSquare(0)).to.be.reverted
        })

        it("Should allow if enough tokens are paid", async () => {
            // Make sure there's enough allowance and balance
            if ((await token.allowance(owner.address, crosswords.address)).lt(toEth(25))) {
                await tokenOwner.approve(crosswords.address, toEth(25))
                    .then(r => { console.log("Approved 25 tokens!") })
            }
            expect(parseInt(ethers.utils.formatEther(await token.allowance(owner.address, crosswords.address))))
                .to.be.greaterThanOrEqual(25)

            // Make sure the hints can be requested
            // await expect(crosswordsOwner.requestSquare(0))
            //     .to.emit(crosswords, "RequestSquare")
            //     .withArgs(owner.address, 0)

            // await expect(crosswordsOwner.requestWord(0))
            //     .to.emit(crosswords, "RequestWord")
            //     .withArgs(owner.address, 0)

        })
    })


})

