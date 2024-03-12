const express = require("express");
const passport = require("passport");
const cors = require("cors");
require("../services/google-passport.js")(passport);
const { checkToken } = require("../services/token-validator.js");

const googleAuthRouter = express.Router();

// Enable CORS
googleAuthRouter.use(cors({ origin: true, credentials: true }));

// Token validation middleware
googleAuthRouter.use(checkToken);

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Home route
googleAuthRouter.get("/", function (req, res) {
  res.status(200).json({ user: req.user });
});

// Account route
googleAuthRouter.get("/account", ensureAuthenticated, function (req, res) {
  res.status(200).json({ user: req.user });
});

// Login route
googleAuthRouter.get("/login", function (req, res) {
  res.status(200).json({ user: req.user });
});

// Google authentication route
googleAuthRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google authentication callback route
googleAuthRouter.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    // console.log("user", req.user);
  }
);

// Logout route
googleAuthRouter.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = googleAuthRouter;
