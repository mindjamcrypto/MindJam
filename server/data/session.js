const { Session } = require("../config/mongoCollections");

async function addBeginSession(startTime, gameID, account) {
  const SessionCollection = await Session();
  const res = await SessionCollection.insert({
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

module.exports = {
  addBeginSession,
  addEndSession,
};
