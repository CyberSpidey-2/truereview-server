const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
    },
    shop: {
      type: ObjectId,
      ref: "Shop",
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
