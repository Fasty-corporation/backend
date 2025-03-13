const deliveryBoyServices = require("../../services/deliveryBoyServices");
const Order = require("../../models/order");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Shop = require("../../models/shops");
const DeliveryBoy = require("../../models/deliveryboysModel.js");
const otpService = require("../../services/otpService");
// signup boy
const deliveryBoyController = {
    sendOtp: async (req, res) => {
        try {
            const { mobile } = req.body;
    
            if (!mobile) {
                return res.status(400).json({ message: "Mobile number is required" });
            }
    
            // Check if the customer already exists
            let customer = await DeliveryBoy.findOne({ mobile });
    
            if (!customer) {
                // New user: Create a new entry (Unverified user)
                customer = new DeliveryBoy({
                    mobile,
                    current_location: { type: "Point", coordinates: [0, 0] }, // ✅ Default location
                    location_history: [] // ✅ Empty array to prevent schema errors
                });
                await customer.save();
                var message = "OTP sent for registration";
            } else {
                var message = "OTP sent for login";
            }
    
            // Generate & send OTP
            const otp = await otpService.generateOTP(mobile);
            await otpService.sendOTP(mobile, otp);
    
            // Emit event for frontend
            const io = req.app.get("socketio");
            io.emit("otp-sent", { mobile, message });
    
            return res.status(200).json({ message, mobile });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
,    
    
     verifyOtp : async (req, res) => {
        try {
            const { mobile, otp } = req.body;
    
            if (!mobile || !otp) {
                return res.status(400).json({ message: "Mobile number and OTP are required" });
            }
    
            // Find the customer first
            let customer = await DeliveryBoy.findOne({ mobile });
    
            if (!customer) {
                return res.status(404).json({ message: "Customer not found. Please register first." });
            }
    
            // Validate OTP
            const isValidOtp = await otpService.verifyOTP(mobile, otp);
            if (!isValidOtp) {
                return res.status(400).json({ message: "Invalid OTP" });
            }
    
            // Generate JWT token
            const token = jwt.sign({ id: customer.id, mobile: customer.mobile }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
            return res.status(200).json({ message: "OTP verified successfully", token, customer });
    
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    },
// Update Delivery Boy Details
 updateDeliveryBoy : async (req, res) => {
    try {
        const { boy_id } = req.params;
        const { name, mobile, password, current_location, location_history } = req.body;

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

        // ✅ Update Current Location
        if (current_location) {
            if (
                !current_location.coordinates ||
                !Array.isArray(current_location.coordinates) ||
                current_location.coordinates.length !== 2
            ) {
                return res.status(400).json({ message: "Invalid current_location format. Provide [longitude, latitude]." });
            }

            deliveryBoy.current_location = {
                type: "Point",
                coordinates: current_location.coordinates
            };
        }

        // ✅ Append New Location History
        if (location_history) {
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
}

// module.exports = { updateDeliveryBoy };

}

module.exports = deliveryBoyController;