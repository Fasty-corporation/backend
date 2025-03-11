const { Vonage } = require('@vonage/server-sdk');
const Customer = require("../models/customersModel");
const otpStore = new Map(); // Temporary storage for OTPs

// Vonage Configuration
const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY || "67ae8e21" , 
    apiSecret: process.env.VONAGE_API_SECRET || "i5vmyWuVzdnYuct6"
});

const otpService = {
    // Generate a 6-digit OTP and store it with a 2-hour expiry
    generateOTP: (mobile) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours validity
        otpStore.set(mobile, { otp, expiresAt });

        console.log(`OTP for ${mobile}: ${otp} (expires at ${new Date(expiresAt).toISOString()})`);
        return otp;
    },

    // Send OTP using Vonage SMS API
    sendOTP: async (mobile, otp) => {
        try {
            const from = "Vonage"; // Sender name
            const to = mobile;
            const text = `Your OTP code is: ${otp}. It will expire in 2 hours.`;

            const response = await vonage.sms.send({ to, from, text });

            console.log("Vonage Response:", response);
            return true;
        } catch (error) {
            console.error("Error sending OTP via Vonage:", error);
            return false;
        }
    },

    // Verify OTP
    verifyOTP: (mobile, otp) => {
        const storedOtpData = otpStore.get(mobile);

        if (!storedOtpData) {
            console.log(`No OTP found for mobile: ${mobile}`);
            return false;
        }

        if (Date.now() > storedOtpData.expiresAt) {
            console.log(`OTP expired for mobile: ${mobile}`);
            otpStore.delete(mobile); // Remove expired OTP
            return false;
        }

        if (storedOtpData.otp === otp) {
            console.log(`OTP verified for mobile: ${mobile}`);
            otpStore.delete(mobile); // Remove OTP after verification
            return true;
        }

        console.log(`Invalid OTP entered for mobile: ${mobile}`);
        return false;
    },

    // Get customer by mobile
    getCustomerByMobileService: async (mobile) => {
        try {
            return await Customer.findOne({ where: { mobile } });
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    }
};

module.exports = otpService;
