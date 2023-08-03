const express = require('express');
const router = express.Router();
const { signup, signin, logout, shopProfile } = require('../controllers/shopauthController');
const { isAuthenticated } = require('../middleware/shopAuth');


//auth routes
// /api/signup
router.post('/shop/signup', signup);
// /api/signin
router.post('/shop/signin', signin);
// /api/logout
router.get('/shop/logout', logout);
// /api/me
router.get('/shop/me', isAuthenticated, shopProfile);

module.exports = router;