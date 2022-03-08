const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

// Utility function to not have to deal with decimals
function toEth(n) {
    return ethers.utils.parseEther(n.toString())
}

describe("Crosswords contract", function () {

    let Token, token
    let Crosswords, crosswords
    let owner;

    before(async function () {
        // Deploy the token contract
        Token = await ethers.getContractFactory("MindJam")
        token = await Token.deploy()
        await token.deployed()
        console.log("Deployed token contract at: ", token.address)

        // Deploy crosswords
        Crosswords = await ethers.getContractFactory("Crosswords");
        crosswords = await Crosswords.deploy(token.address);
        await crosswords.deployed();
        console.log("Deployed crosswords contract at", crosswords.address);

        // Get the signers
        [owner, s1, s2] = await ethers.getSigners();
        crosswords = crosswords.connect(owner)
        crosswordsS1 = crosswords.connect(s1)
        crosswordsS2 = crosswords.connect(s2)
        tokenS1 = token.connect(s1)

        // Create new crossword
        await crosswords.newCrossword(toEth(10), toEth(15), toEth(100))

        // Mint S1 100 tokens
        await token.mint(s1.address, toEth(100))
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

        it("Should have the right values", async () => {
            let firstCrossword = await crosswords.crosswords(0)

            expect(firstCrossword[0]).to.equal(toEth(10))
            expect(firstCrossword[1]).to.equal(toEth(15))
            expect(firstCrossword[2]).to.equal(toEth(100))
            // console.log(`The whole crossword structure: ${firstCrossword}`)
        })

    })

    describe("Request hints", () => {

        it("Should revert if no token allowance", async () => {
            await expect(crosswordsS1.requestWord(0)).to.be.reverted
        })

        it("Should revert if not enough tokens allowed", async () => {

            // Allow for less than enough (5 tokens)
            await tokenS1.approve(crosswords.address, toEth(5))
            expect(await token.allowance(s1.address, crosswords.address)).to.equal(toEth(5))

            // Check if tx gets reverted
            await expect(crosswordsS1.requestSquare(0)).to.be.reverted
            await expect(crosswordsS1.requestWord(0)).to.be.reverted

        })

        it("Should emit event if the payment is made", async () => {
            // Allow spending for enough tokens (30 tokens)
            await tokenS1.approve(crosswords.address, toEth(30))
            expect(await token.allowance(s1.address, crosswords.address)).to.be.equal(toEth(30))

            // Check wether the events get correctly emitted and the payments are made
            expect(crosswordsS1.requestSquare(0))
                .to.emit(crosswords, "RequestSquare")
                .withArgs(s1.address, 0)
            //.and.to.changeTokenBalances(token, [crosswords, s1], [toEth(10), toEth(-10)]);

            expect(crosswordsS1.requestWord(0))
                .to.emit(crosswords, "RequestWord")
                .withArgs(s1.address, 0)
            //.to.changeTokenBalances(token, [crosswords, s1], [toEth(15), toEth(-15)]);
        });
    });

    describe("24h Challenge", () => {

        before(async () => {
            // Later needed
            await crosswords.endSession(0, 100, s1.address)
        })
        it("The challenge should still be active", async () => {
            expect(await crosswords.isChallengeOn(0)).to.equal(true);
        });

        it("Challenge should end after 24 hours", async () => {
            // Make 24 hours pass
            await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 365 + 1]);
            await ethers.provider.send("evm_mine");

            expect(await crosswords.isChallengeOn(0)).to.equal(false);
        })
    })

    describe("End a session", () => {
        before(async () => {
            // Create new crossword, since the challenge is over on the previous one
            await crosswords.newCrossword(toEth(10), toEth(15), toEth(100))

            // End a session
            await crosswords.endSession(1, 100, s1.address)
        });

        it("Shouldn't allow 0 time", async () => {
            expect(crosswords.endSession(1, 0, s1.address)).to.be.reverted
        });

        it("Should show the correct winners", async () => {
            expect(await crosswords.getWinner(0)).to.equal(s1.address)
            expect(await crosswords.getWinner(1)).to.equal(s1.address)
        });

        it("Should replace the winner", async () => {
            await crosswords.endSession(1, 90, s2.address)
            expect(await crosswords.getWinner(1)).to.equal(s2.address)
        })
    })

    describe("Pay winner function", () => {
        before(async () => {
            // Mint the  contract 1000 tokens
            await token.mint(crosswords.address, toEth(1000))
        })

        it("Shouldn't allow anyone but the winner to pay themselves", async () => {
            // from owner
            expect(crosswords.payWinner(0)).to.be.reverted

            // from s2
            expect(crosswordsS2.payWinner(0)).to.be.reverted
        })

        it("Shouldn't allow to pay when the challenge isn't over", async () => {
            expect(crosswords.payWinner(1)).to.be.reverted;
            expect(crosswordsS1.payWinner(1)).to.be.reverted;
            expect(crosswordsS2.payWinner(1)).to.be.reverted;
        })

        it("Should pay the winner", async () => {

            await crosswordsS1.payWinner(0)
            expect(await token.balanceOf(s1.address)).to.equal(toEth(75 + 100))
            expect(await token.balanceOf(crosswords.address)).to.equal(toEth(1000 + 10 + 15 - 100))

            expect(await crosswords.hasWinnerBeenPaid(0)).to.equal(true)
        })
    })

    describe("Withdraw function", () => {
        it("Shouldn't allow anyone but the owner to withdraw", async () => {
            expect(crosswordsS1.withdraw(s1.address)).to.be.reverted
        })

        it("Should withdraw all the tokens from the contract", async () => {
            await crosswords.withdraw(owner.address)

            let ownerBalance = await token.balanceOf(owner.address)
            let contractBalance = await token.balanceOf(crosswords.address)
            expect(await token.balanceOf(crosswords.address)).to.equal(0)
            expect(await token.balanceOf(owner.address)).to.equal(ownerBalance.add(contractBalance))
        })
    })

})