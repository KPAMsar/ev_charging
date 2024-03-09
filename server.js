const express = require("express");
require("dotenv").config();

const AppRoutes = require("./src/routes/app");

const app = express();

app.use("", AppRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
