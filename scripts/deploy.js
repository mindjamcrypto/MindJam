// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Grab the contract factory for NFT
  const MindJamNFT = await ethers.getContractFactory("MindJamNFT");
  // Start NFT deployment, returning a promise that resolves to a contract object
  const mjNFT = await MindJamNFT.deploy(); // Instance of the contract
  console.log("MindJamNFT Contract deployed to address:", mjNFT.address);

  // Grab the contract factory for MindJam Token
  const MindJam = await ethers.getContractFactory("MindJam");
  // Start Token deployment, returning a promise that resolves to a contract object
  const mtoken = await MindJam.deploy();
  await mtoken.deployed();
  console.log("MindJam Token Contract deployed to address:", mtoken.address);

  //Deploy Crossword smartcontract
  const Crosswords = await ethers.getContractFactory("Crosswords");
  const crosswords = await Crosswords.deploy(mtoken.address);
  await crosswords.deployed();
  console.log(`Crosswords Contract deployed at ${crosswords.address}`);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(mtoken, crosswords, mjNFT);
}

function saveFrontendFiles(mtoken, crosswords, mjNFT) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(
      {
        MindJam: mtoken.address,
        Crosswords: crosswords.address,
        MindJamNFT: mjNFT.address,
      },
      undefined,
      2
    )
  );

  const MtokenArtifact = artifacts.readArtifactSync("MindJam");
  const CrosswordsArtifact = artifacts.readArtifactSync("Crosswords");

  fs.writeFileSync(
    contractsDir + "/MindJam.json",
    JSON.stringify(MtokenArtifact, null, 2)
  );
  fs.writeFileSync(
    contractsDir + "/Crosswords.json",
    JSON.stringify(CrosswordsArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
