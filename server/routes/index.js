var express = require("express");
var router = express.Router();
const crosswordsData = require("../data/crosswords");
/* GET home page. */
router.get("/", async (req, res) => {
  const crosswords = await crosswordsData.getAllCrosswords();
  console.log(crosswords);
});

module.exports = router;
