// const jwt = require("jsonwebtoken");
// const logger = require("../../logger");

// const authenticate = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     // return console.log("token", token);

//     if (!token) {
//       logger.error("Invalid Token");
//       return res.status(500).json({
//         message: "Mal formed token",
//       });
//     }

//     const decode = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
//     // console.log("decode", decode);
//     req.user = decode;
//     return next();
//   } catch (error) {
//     logger.error("Authentication error==>", error);
//     return res.status(403).json({
//       message: "Authentication Failed!",
//     });
//   }
// };

// module.exports = authenticate;

const jwt = require("jsonwebtoken");
const logger = require("../../logger");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.error("Invalid Token: Token not provided");
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("asdfafasdfasd", token);
    if (!token) {
      logger.error("Invalid Token: Malformed token");
      return res.status(401).json({
        message: "Malformed token",
      });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Authentication error:", error.message);
    return res.status(403).json({
      message: "Authentication Failed!",
    });
  }
};

module.exports = authenticate;
