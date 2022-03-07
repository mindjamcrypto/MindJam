require("dotenv").config();
const API_URL = process.env.INFURA_API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MindJamNFT.sol/MindJamNFT.json");
//console.log(JSON.stringify(contract.abi));
//Work in progress...
