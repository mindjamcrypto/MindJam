var express = require("express");
var router = express.Router();
const sessionData = require("../data/sessionData");

router.post("/start", async (req, res) => {
  const { startTime, gameID, account } = req.body.params;
  console.log("GAMEID", gameID);
  const result = await sessionData.addBeginSession(startTime, gameID, account);
  console.log(result);
  res.send(result);
});

router.post("/end", async (req, res) => {
  const { endTime, gameID, account } = req.body.params;
  const result = await sessionData.addEndSession(endTime, gameID, account);
  res.send(result);
});

router.get("/check", async (req, res) => {
  const { gameID, account } = req.query;
  const hasSession = await sessionData.checkSession(
    //checks to make sure we are not adding a duplicate session for user
    gameID,
    account
  );
  res.send(hasSession);
});
module.exports = router;
