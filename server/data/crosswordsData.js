const { Games } = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");

async function getAllCrosswords() {
  const gamesCollection = await Games();
  const all = await gamesCollection.find({ GameTypeID: 1 }).toArray();

  return all;
}
async function getCrosswordById(_id) {
  const gamesCollection = await Games();
  //console.log(_id);
  const crossword = await gamesCollection.findOne({ _id: ObjectId(_id) });
  //console.log(crossword);
  return crossword;
}

module.exports = {
  getAllCrosswords,
  getCrosswordById,
};
