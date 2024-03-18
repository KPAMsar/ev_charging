const mongoose = require("mongoose");
require("./src/database/connection");
mongoose.Promise = global.Promise;

const loadUsers = require("./src/database/adminSeeder");

loadUsers();
