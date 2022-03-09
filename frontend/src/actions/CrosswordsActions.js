const { ethers } = require("ethers");
const crosswordsContract = require("../contracts/Crosswords.json");
const MindJam = require("../contracts/MindJam.json");
const contractAdresses = require("../contracts/contract-address.json");
const provider = new ethers.providers.Web3Provider(window.ethereum);

export const getSquareHint = async (address, id, price) => {
  var res;
  console.log(address);
  const signer = await provider.getSigner(address);
  const crosswords = new ethers.Contract(
    contractAdresses.Crosswords,
    crosswordsContract.abi,
    signer
  );
  const mindJam = new ethers.Contract(
    contractAdresses.MindJam,
    MindJam.abi,
    signer
  );

  await mindJam
    .connect(signer)
    ._beforeTokenTransfer(signer.address, crosswords.address, price.toString());

  await crosswords.connect(signer).requestSquare(id);

  provider.on("RequestSquareReveal", (_address, _id) => {
    if (_address === address && id == id) {
      res = true;
    }
  });
  return res ? res : false;
};
