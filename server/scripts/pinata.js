require("dotenv").config();
const axios = require("axios");
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;

const pinToIPFS = async (data, type) => {
  let url, header;
  //making axios POST request to Pinata ⬇️
  if (type == "json") {
    url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    header = {
      pinata_api_key: key,
      pinata_secret_api_key: secret,
    };
    console.log("JSON data===========", data);
  } else {
    url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    header = {
      "Content-Type": `multipart/form-data; boundary= ${data._boundary}`,
      pinata_api_key: key,
      pinata_secret_api_key: secret,
    };
  }
  return axios
    .post(url, data, {
      headers: header,
    })
    .then(function (response) {
      return {
        success: true,
        pinataUrl:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
module.exports = { pinToIPFS };
