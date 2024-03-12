"use strict";

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const moment = require("moment");

const User = require("../models/user.js");

// auth crendtials will be stored in this file
const authCredentials = require("../config/auth.credentials.config");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });

  // For Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: authCredentials.googleClientID,
        clientSecret: authCredentials.googleClientSecret,
        callbackURL: "/auth/google/redirect",
      },
      (accessToken, refreshToken, profile, done) => {
        // profile has all google login data

        // check if user id already inserted
        User.findOne({ userId: profile.id }).then((existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            // new user case
            // insert new user id
            const email =
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null;

            new User({
              userId: profile.id,
              email: email,
              name: profile.displayName,
              picture:
                profile.photos && profile.photos.length > 0
                  ? profile.photos[0].value
                  : null,
            })
              .save()
              .then((user) => {
                done(null, user);
              });
          }
        });
      }
    )
  );
};
