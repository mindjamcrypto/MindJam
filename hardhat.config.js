require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");
const { INFURA_API_URL, PRIVATE_KEY } = process.env;
// If you are using MetaMask, be sure to change the chainId to 1337
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.3",
      },
      {
        version: "0.8.11",
      },
    ],
  },
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    mumbai: {
      url: INFURA_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
