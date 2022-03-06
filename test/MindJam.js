const { expect } = require("chai");

describe("MindJam Token Contract", () => {
  let Token;
  let mindjamToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async () => {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("MindJam");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    // deploy our contract, which will be used in all tests
    mindjamToken = await Token.deploy();

    // We can interact with the contract by calling `mindjamToken.method()`
    await mindjamToken.deployed();
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await mindjamToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async () => {
      const ownerBalance = await mindjamToken.balanceOf(owner.address);
      expect(await mindjamToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", () => {
    it("Should transfer tokens between different accounts.", async () => {
      // Transfer 100 tokens from owner to addr1
      await mindjamToken.transfer(addr1.address, 100);
      const addr1Balance1 = await mindjamToken.balanceOf(addr1.address);
      expect(addr1Balance1).to.equal(100);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await mindjamToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await mindjamToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
      const addr1Balance2 = await mindjamToken.balanceOf(addr1.address);
      expect(addr1Balance2).to.equal(50);
    });

    it("Should fail to transfer tokens when the sender doesn't have enough balance.", async () => {
      const initialOwnerBalance = await mindjamToken.balanceOf(owner.address);
      await expect(
        mindjamToken.transfer(addr1.address, initialOwnerBalance + 1)
      ).to.be.reverted;
    });

    it("Should not pay the winner when the owner doesn't have enough balance", async () => {
      const initialOwnerBalance = await mindjamToken.balanceOf(owner.address);
      await expect(
        mindjamToken.payWinner(addr1.address, initialOwnerBalance + 1)
      ).to.be.reverted;
    });
  });
});
