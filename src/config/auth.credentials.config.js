// module.exports = {
//   googleauth: {
//     clientId: process.env.CLIENT_ID, // Your client ID
//     clientSecret: process.env., // Your client secret
//     callBackUrl: "", // Your callback URL
//   },
// };

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  FACEBOOK_APP_ID: "",
  FACEBOOK_APP_SECRET: "",
};
