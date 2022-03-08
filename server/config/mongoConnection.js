const MongoClient = require("mongodb").MongoClient;
let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(process.env.serverUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = await _connection.db("MindJam");
  }

  return _db;
};
