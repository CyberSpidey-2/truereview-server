const Shop = require("../models/shopModel");
const ErrorResponse = require("../utils/errorResponse");

exports.signup = async (req, res, next) => {
  const { email } = req.body;

  if (req.body.uid == undefined) {
    let x = String(Math.floor(Math.random() * 1000000000000000000000000 + 1));
    req.body.uid = x;
  }
  const shopExist = await Shop.findOne({ email });
  if (shopExist) {
    return next(new ErrorResponse("E-mail already registred", 400));
  }
  try {
    const shop = await Shop.create(req.body);
    sendTokenResponse(shop, 200, res);
    // res.status(201).json({
    //   success: true,
    //   shop,
    // });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email) {
      return next(new ErrorResponse("please add an email", 403));
    }
    if (!password) {
      return next(new ErrorResponse("please add a password", 403));
    }

    //check shop's email
    const shop = await Shop.findOne({ email });
    if (!shop) {
      return next(new ErrorResponse("invalid credentials", 400));
    }
    //check password
    const isMatched = await shop.comparePassword(password);
    if (!isMatched) {
      return next(new ErrorResponse("invalid credentials", 400));
    }

    sendTokenResponse(shop, 200, res);
  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = async (shop, codeStatus, res) => {
  const token = await shop.getJwtToken();
  res
    .status(codeStatus)
    .cookie("token", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
    .json({ success: true, token, shop });
};

// log out
exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "logged out",
  });
};

// shop profile
exports.shopProfile = async (req, res, next) => {
  const shop = await Shop.findById(req.shop.id).select("-password");

  res.status(200).json({
    success: true,
    shop,
  });
};
