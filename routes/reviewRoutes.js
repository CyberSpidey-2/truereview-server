const express = require("express");
const router = express.Router();
const {
  addReview,
  showReview,
  editReview,
  deleteReview,
} = require("../controllers/reviewController");
const { isAuthenticated } = require("../middleware/auth");

//review routes

// /api/review/add
router.post("/review/add/:id", isAuthenticated, addReview);
// /api/review/show/:id
router.get("/review/show/:id", showReview);
// /api/review/edit/:review_id
router.put("/review/edit/:review_id", isAuthenticated, editReview);
// /api/review/delete/:review_id
router.delete("/review/delete/:review_id", isAuthenticated, deleteReview);

module.exports = router;
