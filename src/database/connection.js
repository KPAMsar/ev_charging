const mongoose = require("mongoose");
require("dotenv").config();
const config = require("../config");

const options = {
  useNewUrlParser: true,

  useUnifiedTopology: true,
};

mongoose
  .connect(config.DB_URL)
  .then(() => {
    console.log("database successfully connected");
  })
  .catch((err) => {
    console.log("database connection failed");
    console.log(err);
  });
