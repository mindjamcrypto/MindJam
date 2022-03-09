var express = require("express");
var router = express.Router();
const gameTypeData = require("../data/gameTypeData");

router.get("/", async (req, res) => {
  const gameTypes = await gameTypeData.getAllGameTypes();
  res.send(gameTypes);
});

module.exports = router;
