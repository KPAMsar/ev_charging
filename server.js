const express = require("express");
require("dotenv").config();
require("./src/database/connection");
const passport = require("passport");
const session = require("express-session");

const AppRoutes = require("./src/routes/app");
const GoogleAuthRouter = require("./src/routes/goggle-auth");
const AuthRoutes = require("./src/routes/auth");
const PrivacyPolicyRoutes = require("./src/routes/privacyPolicy");
const FAQRoutes = require("./src/routes/faq");
const TermsConditionsRoutes = require("./src/routes/terms&conditions");

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.session_key,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("", AppRoutes);
app.use("", GoogleAuthRouter);
app.use("/api/auth/", AuthRoutes);
app.use("/api/privacy-policy", PrivacyPolicyRoutes);
app.use("/api/faq", FAQRoutes);
app.use("/api/terms-conditions", TermsConditionsRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
