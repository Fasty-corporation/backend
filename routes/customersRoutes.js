const express = require('express');
const { sendOtp, verifyOtp, loginCustomer, verifyLoginOTP, updateCustomer } = require('../controllers/user/customersController');
const router = express.Router();

router.post("/send-otp", sendOtp)
router.post("/verify-otp",verifyOtp)
router.post("/login",loginCustomer)
router.post("/login-verify",verifyLoginOTP)
router.put("/update/:customer_id",updateCustomer)

module.exports = router;
