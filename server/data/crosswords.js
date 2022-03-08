const { crosswords } = require("../config/mongoCollections");

async function getAllCrosswords() {
  const crosswordsCollection = await crosswords();
  const all = await crosswordsCollection.find({}).toArray();
  return all;
}
async function getCrosswordById(_id) {
  const crosswordsCollection = await crosswords();
  const all = await crosswordsCollection.findOne({ id: _id });
  return all;
}

module.exports = {
  getAllCrosswords,
  getCrosswordById,
};
