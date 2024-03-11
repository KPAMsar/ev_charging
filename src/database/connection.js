const mongoose = require("mongoose");
const { uri } = require("../config/mongo.database.config");
require("../config/mongo.database.config");

exports.dbConnection = mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("database successfully connected");
  })
  .catch((err) => {
    console.log("database connection failed");
    console.log(err);
  });
