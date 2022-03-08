var express = require("express");
var router = express.Router();
const crosswordsData = require("../data/crosswords");
/* GET home page. */
router.get("/crosswords", async (req, res) => {
  const crosswords = await crosswordsData.getAllCrosswords();
  console.log(crosswords);
  res.send(crosswords);
});
router.get("/crosswords/:id", async (req, res) => {
  const crossword = await crosswordsData.getCrosswordById();
  res.send(crossword);
});

module.exports = router;
