var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var User = new Schema({
  // google: {
  //   id: String,
  //   token: String,
  //   refreshToken: String,
  //   displayName: String,
  //   email: String,
  //   expiry_date: Number,
  // },
  name: String,
  email: String,
  role: {
    type: String,
    enum: ["admin", "user", "super-admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", User);
