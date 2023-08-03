const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      trim: true,
      required: [true, "shop name is required"],
      maxlength: 32,
      unique: false,
    },
    category: {
      type: String,
      trim: true,
      required: [true, "category is required"],
      maxlength: 32,
      unique: false,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "e-mail is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    location: {
      type: String,
      trim: true,
      required: [true, "location is required"],
      unique: false,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password is required"],
      minlength: [6, "password must have at least (6) caracters"],
      unique: false,
    },
    // reviews :{
    //    type: [String] // (review , user_id)
    //    // type: [ObjectId],
    // },
    imageUrl: {
      type: [String],
    },

    review: {
      type: ObjectId,
      ref: "Review",
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },
    uid: {
      type: [String],
      unique: false,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//encrypting password before saving
shopSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// compare user password
shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// return a JWT token
shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });
};

module.exports = mongoose.model("Shop", shopSchema);

// need to make a model for review and then will link shop and user with it i.e.
//the user which has written the review and the shop for which it has given the feedback
