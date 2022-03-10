require("dotenv").config();
var FormData = require("form-data");
var fs = require("fs");
const { pinToIPFS } = require("./pinata");

const getTokenURI = async (nftType, gameID, account) => {
  let data = new FormData();
  data.append("file", fs.createReadStream(`./nftImages/${nftType}.png`));
  //Upload the image on IPFS & get its imageURI
  const pinataImageResponse = await pinToIPFS(data, "image");
  if (!pinataImageResponse.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading the Image",
    };
  }

  const imageURI = pinataImageResponse.pinataUrl;

  //Prepare the NFT metadata adding the imageURI
  const metadata = {};
  metadata["name"] = `${nftType}` + " NFT";
  metadata["description"] = "Awesome MindJam NFT for " + `${nftType}`;
  metadata["image"] = imageURI;
  metadata["attributes"] = [];
  console.log("metadata before stringify=====", metadata);
  //Upload the metadata on IPFS & get its tokenURI
  const pinataMetadataResponse = await pinToIPFS(metadata, "json");
  if (!pinataMetadataResponse.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading the JSON file",
    };
  }
  const tokenURI = pinataMetadataResponse.pinataUrl;

  return {
    success: true,
    status: tokenURI,
  };
};
module.exports = { getTokenURI };
