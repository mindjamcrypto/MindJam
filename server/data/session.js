const { Session } = require("../config/mongoCollections");

async function addBeginSession(startTime, gameID, account) {
  const SessionCollection = await Session();
  const res = await SessionCollection.insertOne({
    GameID: gameID,
    PlayerId: account,
    SessionStartTime: startTime,
    SessionEndTime: "",
    FinalResult: false,
    "Winner Paid": "",
  });
  return res;
}

async function addEndSession(endTime, gameID, account) {
  const SessionCollection = await Session();
  const res = await SessionCollection.updateOne(
    { PlayerId: account, GameID: gameID },
    {
      SessionEndTime: endTime,
      FinalResult: true,
    }
  );
  return res;
}

async function checkSession(gameID, account) {
  const SessionCollection = await Session();
  const res = await SessionCollection.findOne({
    GameID: gameID,
    PlayerID: account,
  });
  console.log(res);

  return res !== null; // returns true if already has a session in collection
}

module.exports = {
  addBeginSession,
  addEndSession,
  checkSession,
};
