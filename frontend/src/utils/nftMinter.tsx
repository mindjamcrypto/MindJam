import "dotenv/config";
import axios from "axios";

const alchemyKey = process.env.REACT_APP_ALCHEMY_API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
declare var window: any;

const contractABI = require("../contracts/MindJamNFT.json").abi;
const contractAddress =
  require("../contracts/contract-address.json").MindJamNFT;

export const mintNFT = async (nftType: String) => {
  console.log("contractABI==", contractABI);
  console.log("contractAddress==", contractAddress);
  console.log(
    "window.ethereum.selectedAddress==",
    window.ethereum.selectedAddress
  );

  let res: any = await axios.post(
    "https://mindjam-backend.herokuapp.com/tokenURI",
    {
      params: {
        nftType,
        gameID: "222",
        account: window.ethereum.selectedAddress,
      },
    }
  );
  console.log("result from the backend for tokenURI==", res);

  if (!res.data.success) {
    console.log("Error in ending session");
    return { success: false, status: res.status };
  }

  const tokenURI = res.data.status;
  console.log("tokenURI::", tokenURI);
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  console.log("hello1");
  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(), //make call to NFT smart contract
  };
  console.log("hello2");
  //sign the transaction via Metamask
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    console.log("hello3");
    return {
      success: true,
      status:
        "✅ Check out your transaction on Polygonscan: https://mumbai.polygonscan.com/tx/" +
        txHash,
    };
  } catch (error: any) {
    console.log("hello4");
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};
