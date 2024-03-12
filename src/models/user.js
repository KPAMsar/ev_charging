var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var User = new Schema({
  userId: String,
  name: String,
  picture: String,
  email: String,
  role: {
    type: String,
    enum: ["admin", "user", "super-admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", User);
