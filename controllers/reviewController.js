const Shop = require("../models/shopModel");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");

exports.addReview = async (req, res, next) => {
  const feedback = req.body.review;
  const stars = req.body.rating;

  const shopId = req.params.id;
  // console.log(shopId);

  const transactiondId = req.body.transaction_id;
  const shop = await Shop.findById(shopId);
  const userId = req.user._id;

  const user_name = req.user.firstName + " " + req.user.lastName;

  try {
    const index = shop.uid.indexOf(transactiondId);
    //console.log(index); // if index === -1 => transactionID is not present in the uid array
    if (index > -1) {
      const review_to_be_added = await Review.create({
        review: feedback,
        shop: shopId,
        user: userId,
        userName: user_name,
        message: "Review added successfully",
      });
      shop.totalStars += stars;
      shop.totalUsers++;
      await shop.save();
      const totalStars = shop.totalStars;
      const totalUsers = shop.totalUsers;
      let rating = 0;
      if (totalUsers > 0) rating = (totalStars / totalUsers).toFixed(1);
      shop.uid.splice(index, 1);
      res.status(200).json({
        success: true,
        review_to_be_added,
        rating: rating,
      });
    } else {
      return next(new ErrorResponse("Invalid UID!", 400));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.showReview = async (req, res, next) => {
  const { pageIndex = 1, pageSize = 5 } = req.query;
  const shopId = req.params.id;

  try {
    // execute query with page and limit values
    const reviews = await Review.find({ shop: shopId })
      .sort({ createdAt: -1 })
      .limit(pageSize * 1)
      .skip((pageIndex - 1) * pageSize)
      .exec();

    // get total documents in the Posts collection
    const count = await Review.find({ shop: shopId }).countDocuments();
    //const count = await Posts.countDocuments();

    // return response with posts, total pages, and current page
    res.json({
      success: true,
      reviews,
      pageIndex,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    next(error);
  }
};

//update review by id.
exports.editReview = async (req, res, next) => {
  const review_id = req.params.review_id;
  console.log(review_id);
  try {
    // first , checks whether the user who is trynna edit the review is the only one who has given the review at the first place
    const review = await Review.findById(review_id);
    const id = review.user;
    const id_shop = review.shop;

    if (String(id) === String(req.user._id)) {
      console.log("yes");
      try {
        const data = {
          review: req.body.review,
          user: id,
          shop: id_shop,
        };
        const editedReview = await Review.findByIdAndUpdate(review_id, data, {
          new: true,
        })
          .populate("user", "id")
          .populate("shop", "id_shop");
        // const editedReview = Review.findByIdAndUpdate(review_id , data,{ new: true });
        res.status(200).json({
          success: true,
          editedReview,
        });
      } catch (error) {
        next(error);
      }
    } else {
      return next(
        new ErrorResponse("Can not edit reviews given  by others", 400)
      );
    }
  } catch (error) {
    next(error);
  }
};

//delete review
exports.deleteReview = async (req, res, next) => {
  // first , checks whether the user who is trynna edit the review is the only one who has given the review at the first place
  const review_id = req.params.review_id;
  try {
    const review = await Review.findById(review_id);
    const id = review.user;
    const id_shop = review.shop;
    if (String(id) === String(req.user._id)) {
      console.log("yes");
      try {
        const review_delete = await Review.findByIdAndRemove(review_id);
        res.status(200).json({
          success: true,
          message: "Review deleted",
        });
      } catch (error) {
        next(error);
      }
    } else {
      return next(
        new ErrorResponse("Can not edit reviews given  by others", 400)
      );
    }
  } catch (error) {
    next(new ErrorResponse("server error", 500));
  }
};
