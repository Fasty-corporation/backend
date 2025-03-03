const express = require('express');
const { sendOtp, verifyOtp, updateDeliveryBoy, login, verifyLogin } = require('../controllers/user/deliveryboysController');
const router = express.Router();

router.post("/delivery/send-otp",sendOtp)
router.post("/delivery/verify-otp", verifyOtp),
router.put("/update/:boy_id",updateDeliveryBoy),
router.post("/login",login)
router.post("/verifylogin",verifyLogin)
module.exports = router;
