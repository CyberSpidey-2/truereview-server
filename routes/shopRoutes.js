const express = require("express");
const router = express.Router();
const { singleShop, showShops } = require("../controllers/shopController");
//const { isAuthenticated, isAdmin } = require('../middleware/auth');

//shops routes

// /api/shop/id
router.get("/shop/:id", singleShop);
// /api/shops/show
router.get("/shops/show", showShops);

module.exports = router;
