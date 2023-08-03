const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const Shop = require("../models/shopModel");

// check is user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  //   const { token } = req.cookies;   // use this for postman
  const { token } = req.headers;
  //   console.log("sahil");
  //   console.log(token);
  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.shop = await Shop.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

//middleware for admin
exports.isAdmin = (req, res, next) => {
  if (req.shop.role === 0) {
    return next(new ErrorResponse("Access denied, you must an admin", 401));
  }
  next();
};
