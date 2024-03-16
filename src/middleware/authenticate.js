const jwt = require("jsonwebtoken");
const logger = require("../../logger");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      logger.error("Invalid Token");
      return res.status(500).json({
        message: "Mal formed token",
      });
    }
    const decode = await jwt.verify(token, "AzTQ,RP)0(");

    req.user = decode;
    return next();
  } catch (error) {
    logger.error("Authentication error==>", error);
    return res.status(403).json({
      message: "Authentication Failed!",
    });
  }
};

module.exports = authenticate;
