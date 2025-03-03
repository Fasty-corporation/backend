const deliveryBoyServices = require("../../services/deliveryBoyServices");
const Order = require("../../models/order");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Shop = require("../../models/shops");
const DeliveryBoy = require("../../models/deliveryboysModel.js");
const otpService = require("../../services/otpService")
const deliveryBoyController = {
     sendOtp : async (req, res) => {
        try {
            const { mobile } = req.body;
            if (!mobile) {
                return res.status(400).json({ message: "Mobile number is required" });
            }
    
            // Check if customer already exists
            let customer = await DeliveryBoy.findOne({ mobile });
            if (customer) {
                return res.status(400).json({ message: "Mobile number already registered. Please log in instead." });
            }
    
            if (!customer) {
                // Create a new customer with unverified status
                customer = new DeliveryBoy({ mobile });
                await customer.save();
            }
    
            // Generate and send OTP
            const otp = await otpService.generateOTP(mobile);
            await otpService.sendOTP(mobile, otp);
    
            // Emit OTP sent event
            const io = req.app.get('socketio');
            io.emit("otp-sent", { mobile, message: "OTP sent successfully" });
    
            return res.status(200).json({ message: "OTP sent successfully", mobile });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
     verifyOtp : async (req, res) => {
        try {
            const { mobile, otp } = req.body;
    
            if (!mobile || !otp) {
                return res.status(400).json({ message: "Mobile number and OTP are required" });
            }
    
            const isOtpValid = otpService.verifyOTP(mobile, otp);
            if (!isOtpValid) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }
    
            // Update customer as verified
            const updatedCustomer = await DeliveryBoy.findOneAndUpdate(
                { mobile },
                { otpVerified: true },
                { new: true }
            );
    
            if (!updatedCustomer) {
                return res.status(404).json({ message: "Customer not found" });
            }
    
            // Emit OTP verification success event
            const io = req.app.get('socketio');
            io.emit("otp-verified", { mobile, message: "OTP verified successfully" });
    
            return res.status(200).json({ message: "OTP verified successfully", customer: updatedCustomer });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
// Update Delivery Boy Details
 updateDeliveryBoy : async (req, res) => {
    try {
        const { boy_id } = req.params;
        const { name, mobile, password, location_history } = req.body;

        if (!boy_id) {
            return res.status(400).json({ message: "Delivery boy ID is required" });
        }

        // Check if delivery boy exists
        let deliveryBoy = await DeliveryBoy.findById(boy_id);
        if (!deliveryBoy) {
            return res.status(404).json({ message: "Delivery boy not found" });
        }

        // Update fields if provided
        if (name) deliveryBoy.name = name;
        if (mobile) {
            // Validate mobile number format (10-15 digits)
            const mobileRegex = /^\d{10,15}$/;
            if (!mobileRegex.test(mobile)) {
                return res.status(400).json({ message: "Invalid mobile number" });
            }

            // Check if the new mobile number is already taken
            const existingBoy = await DeliveryBoy.findOne({ mobile });
            if (existingBoy && existingBoy._id.toString() !== boy_id) {
                return res.status(400).json({ message: "Mobile number already in use" });
            }

            deliveryBoy.mobile = mobile;
        }
        if (password) deliveryBoy.password = password;
        if (location_history) {
            // Validate location history
            if (!Array.isArray(location_history) || !location_history.length) {
                return res.status(400).json({ message: "Invalid location history data" });
            }
            deliveryBoy.location_history = [...deliveryBoy.location_history, ...location_history];
        }

        // Save updated delivery boy details
        await deliveryBoy.save();

        return res.status(200).json({ message: "Delivery boy updated successfully", deliveryBoy });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
},
login: async (req, res) => {
    try {
        const { mobile } = req.body;

        if (!mobile) {
            return res.status(400).json({ message: "Mobile number is required" });
        }

        // Check if the delivery boy exists
        let deliveryBoy = await DeliveryBoy.findOne({ mobile });

        if (!deliveryBoy) {
            return res.status(404).json({ message: "Delivery boy not found" });
        }

        // Generate and send OTP
        const otp = await otpService.generateOTP(mobile);
        await otpService.sendOTP(mobile, otp);

        return res.status(200).json({ message: "OTP sent successfully", mobile });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
},

// Verify OTP and Login
verifyLogin: async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        if (!mobile || !otp) {
            return res.status(400).json({ message: "Mobile number and OTP are required" });
        }

        // Verify OTP
        const isOtpValid = otpService.verifyOTP(mobile, otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Find the delivery boy
        const deliveryBoy = await DeliveryBoy.findOne({ mobile });
        if (!deliveryBoy) {
            return res.status(404).json({ message: "Delivery boy not found" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: deliveryBoy._id, mobile: deliveryBoy.mobile },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            deliveryBoy,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
},
}

module.exports = deliveryBoyController;