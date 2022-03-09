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
      $set: { SessionEndTime: endTime, FinalResult: true },
    }
  );
  console.log("UPDATE?", res);
  return res;
}

async function checkSession(gameID, account) {
  const SessionCollection = await Session();
  console.log("gameID", gameID);
  const res = await SessionCollection.findOne({
    GameID: gameID,
    PlayerId: account,
  });
  console.log(res);

  return res !== null; // returns true if already has a session in collection
}

module.exports = {
  addBeginSession,
  addEndSession,
  checkSession,
};
