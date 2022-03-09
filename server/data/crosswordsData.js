const { Games } = require("../config/mongoCollections");

async function getAllCrosswords() {
  const gamesCollection = await Games();
  const all = await gamesCollection.find({ GameTypeID: 1 }).toArray();
  return all;
}
async function getCrosswordById(_id) {
  const gamesCollection = await Games();
  const crossword = await gamesCollection.findOne({ id: _id });
  return crossword;
}

module.exports = {
  getAllCrosswords,
  getCrosswordById,
};
