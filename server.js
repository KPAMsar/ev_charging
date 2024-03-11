const express = require("express");
require("dotenv").config();
require("./src/database/connection");

const AppRoutes = require("./src/routes/app");

const app = express();

app.use("", AppRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
