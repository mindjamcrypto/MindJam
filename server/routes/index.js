var express = require("express");
var router = express.Router();
const crosswordsData = require("../data/crosswords");
const gameTypeData = require("../data/gameType");
const sessionData = require("../data/session");

router.get("/crosswords", async (req, res) => {
  const crosswords = await crosswordsData.getAllCrosswords();
  console.log(crosswords);
  res.send(crosswords);
});
router.get("/crosswords/:id", async (req, res) => {
  const crossword = await crosswordsData.getCrosswordById();
  res.send(crossword);
});

router.get("/gameTypes", async (req, res) => {
  const gameTypes = await gameTypeData.getAllGameTypes();
  res.send(gameTypes);
});
router.post("/sessionStart/:startTime/:gameID/:account", async (req, res) => {
  const { startTime, gameID, account } = req.params();
  const sessionTypes = await sessionData.addBeginSession(
    startTime,
    gameID,
    account
  );
  console.log(sessionTypes);
  res.send(sessionTypes);
});

router.post("/endSession/:startTime/:gameID/:account", async (req, res) => {
  const { endTime, gameID, account } = req.params();
  const sessionTypes = await sessionData.addEndSession(
    endTime,
    gameID,
    account
  );
  console.log(sessionTypes);
  res.send(sessionTypes);
});

module.exports = router;
