const jwt = require("jsonwebtoken");
const logger = require("../../logger");

const authorizeUser = (permissions) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.error("Invalid Token: Token not provided");
        return res.status(401).json({
          message: "Token not provided",
        });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        logger.error("Invalid Token: Malformed token");
        return res.status(401).json({
          message: "Malformed token",
        });
      }

      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

      logger.info("Authorization==>", decoded);
      const userRole = decoded.role;

      logger.info("Authorization==> User Role:", userRole);

      if (!userRole || !permissions.includes(userRole)) {
        return res.status(403).json("You are not authorized!");
      }

      req.user = decoded;
      next();
    } catch (error) {
      logger.error("Authorization Error:", error.message);
      return res.status(403).json({
        message: "Authorization Failed!",
      });
    }
  };
};

module.exports = {
  authorizeUser,
};

module.exports = {
  authorizeUser,
};
