const express = require('express');
const { createShop,getAllShops,getShopById,updateShop,deleteShop, loginShop, sendOtp,verifyOtp, verifyLoginOTP, createOrUpdateShopProfile, getShopProfile, deleteShopProfile } = require('../controllers/user/shopController');
const router = express.Router();

// OTP Routes
// router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp)
router.post("/loginverify-otp",verifyLoginOTP)
router.post('/create', createShop);
router.post("/login", loginShop)
router.get('/all', getAllShops);
router.get('/:shopId', getShopById);
router.put('/:shopId', updateShop);
router.delete('/:shopId',deleteShop);

//profile sections
router.put('/:shopId/profile', createOrUpdateShopProfile); // Create/Update Profile
router.get('/:shopId/profile', getShopProfile); // Get Profile
router.delete('/:shopId/profile', deleteShopProfile); // Delete Profile



module.exports = router;
