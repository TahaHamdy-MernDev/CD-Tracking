const jwt = require("jsonwebtoken");
const dbService = require("../utils/dbService");
const userModel = require("../models/userModel");
const RESPONSE_MESSAGES = {
  noTokenProvided: "No token provided, access denied",
  invalidToken: "Invalid token, access denied",
  userNotFound:
    "The user belonging to this token does no longer exist or token mismatch",
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    return req.cookies.jwt;
  }
  return null;
};

const authenticate = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.unAuthorized({ message: RESPONSE_MESSAGES.noTokenProvided });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const freshUser = await dbService.findOne(userModel, {
      _id: decoded.id
    });
    if (!freshUser) {
      return res.recordNotFound({ message: RESPONSE_MESSAGES.userNotFound });
    }

    req.user = freshUser;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.unAuthorized({ message: RESPONSE_MESSAGES.invalidToken });
    }

    return res.unAuthorized({ message: RESPONSE_MESSAGES.invalidToken });
  }
};

const authorizeRoles = (allowedRoles) => (req, res, next) => {
  authenticate(req, res, () => {
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        status: "Forbidden",
        code: 403,
        message:
          "Forbidden: You do not have permission to perform this action.",
        data: null,
      });
    }
  });
};

module.exports = {
  authenticate,
  isAdmin: authorizeRoles(["admin"]),
};
