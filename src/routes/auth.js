const express = require("express");
const passport = require("passport");
const cors = require("cors");
require("../services/google-passport")(passport);
const { checkToken } = require("../services/token-validator.js");

const authRouter = express.Router();

// Enable CORS
authRouter.use(cors({ origin: true, credentials: true }));

// Token validation middleware
authRouter.use(checkToken);

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Home route
authRouter.get("/", function (req, res) {
  res.status(200).json({ user: req.user });
});

// Account route
authRouter.get("/account", ensureAuthenticated, function (req, res) {
  res.status(200).json({ user: req.user });
});

// Login route
authRouter.get("/login", function (req, res) {
  res.status(200).json({ user: req.user });
});

// Google authentication route
authRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    accessType: "offline",
  })
);

// Google authentication callback route
authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Logout route
authRouter.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = authRouter;
