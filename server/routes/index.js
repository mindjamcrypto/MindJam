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
router.post("/sessionStart/", async (req, res) => {
  const { startTime, gameID, account } = req.body.params;

  const sessionTypes = await sessionData.addBeginSession(
    startTime,
    gameID,
    account
  );
  console.log(sessionTypes);
  res.send(sessionTypes);
});

router.post("/endSession/", async (req, res) => {
  const { endTime, gameID, account } = req.body;
  const sessionTypes = await sessionData.addEndSession(
    endTime,
    gameID,
    account
  );
  res.send(sessionTypes);
});

router.get("/sessionCheck/", async (req, res) => {
  const { gameID, account } = req.query;
  const sessionTypes = await sessionData.checkSession(
    //checks to make sure we are not adding a duplicate session for user
    gameID,
    account
  );
  res.send(sessionTypes);
});

module.exports = router;
