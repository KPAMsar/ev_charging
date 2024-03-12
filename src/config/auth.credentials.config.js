require("dotenv").config();

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackURL: process.env.CALLBACK_URL,
  mongoURI: process.env.DB_URL,
  cookieKey: process.env.COOKIE_KEY,
  session_key: process.env.session_key,
  FACEBOOK_APP_ID: "",
  FACEBOOK_APP_SECRET: "",
};
