const Customer = require("../../models/customersModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpService = require("../../services/otpService");
const { io } = require("../../index");

const sendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;

        if (!mobile) {
            return res.status(400).json({ message: "Mobile number is required" });
        }

        // Check if the customer already exists
        let customer = await Customer.findOne({ mobile });

        if (!customer) {
            // New user: Create a new entry (Unverified user)
            customer = new Customer({ mobile });
            await customer.save();
            var message = "OTP sent for registration";
        } else {
            var message = "OTP sent for login";
        }

        // Generate & send OTP
        const otp = await otpService.generateOTP(mobile);
        await otpService.sendOTP(mobile, otp);

        // Emit event for frontend
        const io = req.app.get('socketio');
        io.emit("otp-sent", { mobile, message });

        return res.status(200).json({ message, mobile });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        if (!mobile || !otp) {
            return res.status(400).json({ message: "Mobile number and OTP are required" });
        }

        // Find the customer first
        let customer = await Customer.findOne({ mobile });

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
};

const updateCustomer = async (req, res) => {
    try {
        const { customer_id } = req.params; // Get customer ID from request params
        const updateData = req.body; // Get updated fields from request body

        // Find and update customer
        const updatedCustomer = await Customer.findByIdAndUpdate(customer_id, updateData, {
            new: true, // Return the updated document
            runValidators: true // Ensure validation rules are applied
        });

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: "Error updating customer", error: error.message });
    }
};

module.exports = { 
    sendOtp, 
    verifyOtp, 
    updateCustomer
};