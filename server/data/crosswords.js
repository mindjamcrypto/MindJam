const { crosswords } = require("../config/mongoCollections");

async function getAllCrosswords() {
  const crosswordsCollection = await crosswords();
  const all = await crosswordsCollection.find({}).toArray();
  return all;
}

module.exports = {
  getAllCrosswords,
};
