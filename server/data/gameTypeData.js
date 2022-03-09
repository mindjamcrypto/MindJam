const { GameTypes } = require("../config/mongoCollections");

async function getAllGameTypes() {
  const gameTypeCollection = await GameTypes();
  const all = await gameTypeCollection.find().toArray();
  return all;
}

module.exports = {
  getAllGameTypes,
};
