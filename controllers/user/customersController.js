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

        // Validate mobile number (10 digits, starts with 6-9)
        // const mobileRegex = /^[6-9]\d{9}$/;
        // if (!mobileRegex.test(mobile)) {
        //     return res.status(400).json({ message: "Invalid mobile number. It must be a 10-digit number starting with 6-9." });
        // }

        // Check if the customer already exists with this mobile number
        let customer = await Customer.findOne({ mobile });

        if (customer) {
            return res.status(400).json({ message: "Mobile number already registered. Please log in instead." });
        }

        // Create a new customer entry (unverified)
        customer = new Customer({ mobile });
        await customer.save();

        // Generate and send OTP
        const otp = await otpService.generateOTP(mobile);
        await otpService.sendOTP(mobile, otp);

        // Emit OTP sent event
        const io = req.app.get('socketio');
        io.emit("otp-sent", { mobile, message: "OTP sent successfully" });

        return res.status(200).json({ message: "OTP sent successfully", mobile });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        if (!mobile || !otp) {
            return res.status(400).json({ message: "Mobile number and OTP are required" });
        }

        const existingCustomer = await Customer.findOne({ mobile });
        if (!existingCustomer) {
            return res.status(400).json({ message: "Mobile number is not registered. Try a new mobile number." });
        }


        const isOtpValid = otpService.verifyOTP(mobile, otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Update customer as verified
        const updatedCustomer = await Customer.findOneAndUpdate(
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
};


const loginCustomer = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) {
            return res.status(400).json({ message: "Mobile number is required" });
        }

        const customer = await otpService.getCustomerByMobileService(mobile);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const otp = otpService.generateOTP(mobile);
        await otpService.sendOTP(mobile, otp);

    const io = req.app.post('socketio')
        io.emit("otp-sent", { mobile, message: "OTP sent for login" });

        return res.status(200).json({ message: "OTP sent to mobile number" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Verify Login OTP
const verifyLoginOTP = async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        if (!mobile || !otp) {
            return res.status(400).json({ message: "Mobile number and OTP are required" });
        }

        const isOtpValid = otpService.verifyOTP(mobile, otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const customer = await otpService.getCustomerByMobileService(mobile);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const token = jwt.sign(
            { customerId: customer._id, name: customer.name },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "1h" }
        );

        // Emit login success event
        const io = req.app.get('socketio')
        io.emit("customer-logged-in", { mobile, name: customer.name });

        return res.status(200).json({ token, customer });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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
    loginCustomer, 
    verifyLoginOTP, 
    updateCustomer
};