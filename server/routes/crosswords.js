var express = require("express");
var router = express.Router();
const crosswordsData = require("../data/crosswordsData");

router.get("/", async (req, res) => {
  const crosswords = await crosswordsData.getAllCrosswords();
  console.log(crosswords);
  res.send(crosswords);
});
router.get("/:id", async (req, res) => {
  const crossword = await crosswordsData.getCrosswordById();
  res.send(crossword);
});

module.exports = router;
