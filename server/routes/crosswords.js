var express = require("express");
var router = express.Router();
const crosswordsData = require("../data/crosswordsData");

router.get("/", async (req, res) => {
  const crosswords = await crosswordsData.getAllCrosswords();
  console.log(crosswords);
  res.send(crosswords);
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const crossword = await crosswordsData.getCrosswordById(id);
  res.send(crossword);
});

module.exports = router;
