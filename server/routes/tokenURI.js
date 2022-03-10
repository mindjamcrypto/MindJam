var express = require("express");
var router = express.Router();
const sessionData = require("../data/sessionData");
const { getTokenURI } = require("../scripts/getURI");

router.post("/", async (req, res) => {
  console.log("Got body==========:", req.body);

  const { nftType, gameID, account } = req.body.params;
  console.log("GAMEID", gameID);
  const { success, status } = await getTokenURI(nftType, gameID, account);
  if (success) {
    res.send({
      success: true,
      status: status,
    });
  } else {
    res.send({
      success: false,
      status: status,
    });
  }
});

module.exports = router;
