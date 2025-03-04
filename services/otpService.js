const twilio = require("twilio");
const Customer = require("../models/customersModel");
const otpStore = new Map(); // Temporary storage for OTPs

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);

const otpService = {
    // Generate a 6-digit OTP and store it with a 2-hour expiry
    generateOTP: (mobile) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours validity
        otpStore.set(mobile, { otp, expiresAt });

        console.log(`OTP for ${mobile}: ${otp} (expires at ${new Date(expiresAt).toISOString()})`);
        return otp;
    },

    // Send OTP using Twilio
    sendOTP: async (mobile, otp) => {
        try {
            await client.messages.create({
                body: `Your OTP code is: ${otp}. It will expire in 2 hours.`,
                from: twilioPhoneNumber,
                to: mobile
            });
            return true;
        } catch (error) {
            console.error("Error sending OTP via Twilio:", error);
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

    // Get shop by mobile (Modify this based on your database)
    getShopByMobile: async (mobile) => {
        return await Shop.findOne({ where: { mobile } }); // Replace 'Shop' with your actual model
    },

    getCustomerByMobileService: async (mobile) => {
        try {
            return await Customer.findOne({ mobile }); // Find shop by mobile
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    },
    getCustomerByMobileService: async (mobile) => {
        try {
            return await Customer.findOne({ mobile }); // Find shop by mobile
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    },
};

module.exports = otpService;
