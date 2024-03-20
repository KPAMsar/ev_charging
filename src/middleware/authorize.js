const jwt = require("jsonwebtoken");
const logger = require("../../logger");

const authorizeUser = (permissions) => {
  return (req, res, next) => {
    const token = req.headers.authorization.split(" ");

    const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log(decode)
    console.log("res", decode);

    logger.info("Authorization==>", decode);
    const user_role = decode.role;
    switch (user_role) {
      case "user":
        if (permissions.includes(user_role)) {
          next();
        } else {
          return res.status(401).json("You are not authorized!");
        }
        break;

      case "admin":
        if (permissions.includes(user_role)) {
          next();
        } else {
          return res.status(401).json("You are not authorized!");
        }
        break;
      case "super-admin":
        if (permissions.includes(user_role)) {
          next();
        } else {
          return res.status(401).json("You are not authorized!");
        }
        break;
      default:
        return res.status(400).json("Bad Request!");
    }
  };
};

module.exports = {
  authorizeUser,
};
