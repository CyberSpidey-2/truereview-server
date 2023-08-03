const Shop = require("../models/shopModel");
const ErrorResponse = require("../utils/errorResponse");

exports.adduid = async (req, res, next) => {
  try {
    const id = req.shop._id;

    const shop = await Shop.findById(id);

    const transactiondId = req.body.transaction_id;
    const index = shop.uid.indexOf(transactiondId);
    if (index !== -1) {
      return next(new ErrorResponse("UID should be unique", 400));
    }

    shop.uid.push(transactiondId);
    await shop.save();
    res.status(201).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePhoto = async (req, res, next) => {
  try {
    const id = req.body.shopId;
    const shop = await Shop.findById(id);
    const url = req.body.url;
    const index = req.body.index;
    if (index < 0 || index >= shop.imageUrl.length) {
      return next(new ErrorResponse("Invalid image selection", 400)); // sanity check
    }
    shop.imageUrl[index] = url;
    await shop.save();
    res.status(201).json({
      success: true,
      data: shop,
      imageUrl: shop.imageUrl, // sending the array of the URLs to the frontend
    });
  } catch (error) {
    next(error);
  }
};

exports.addPhoto = async (req, res, next) => {
  try {
    const id = req.body.shopId;
    const shop = await Shop.findById(id);
    const url = req.body.url;
    // console.log(id, shop, url);
    if (shop.imageUrl.length > 4) {
      return next(new ErrorResponse("Image size over", 400)); // sanity check
    }
    shop.imageUrl.push(url);
    await shop.save();
    res.status(201).json({
      success: true,
      data: shop,
      imageUrl: shop.imageUrl,
    });
  } catch (error) {
    next(error);
  }
};
