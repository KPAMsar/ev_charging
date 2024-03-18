require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  DB_URL: process.env.DB_URL,
  session_key: process.env.session_key,
  SENDER_MAIL: process.env.SENDER_MAIL,
  OTP_SENDER_EMAIL: process.env.OTP_SENDER_EMAIL,
  APP_PASSWORD: process.env.APP_PASSWORD,
  SERVICE: process.env.SERVICE,
  COMPANY_MAIL: process.env.COMPANY_MAIL,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY,
};
