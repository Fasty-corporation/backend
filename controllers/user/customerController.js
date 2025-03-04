const Customer = require("../../models/customerModel");
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

        // Check if customer already exists
        let customer = await Customer.findOne({ mobile });

        if (!customer) {
            // Create a new customer with unverified status
            customer = new Customer({ mobile });
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
};
const verifyOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        if (!mobile || !otp) {
            return res.status(400).json({ message: "Mobile number and OTP are required" });
        }

        // const existingCustomer = await Customer.findOne({ mobile });
        // if (!existingCustomer) {
        //     return res.status(400).json({ message: "Mobile number is not registered. Try a new mobile number." });
        // }


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
// const verifyOtp = async (req, res) => {
//     try {
//         const { mobile, otp } = req.body;
//         if (!mobile || !otp) {
//             return res.status(400).json({ message: "Mobile number and OTP are required" });
//         }

//         const isOtpValid = otpService.verifyOTP(mobile, otp);
//         if (!isOtpValid) {
//             return res.status(400).json({ message: "Invalid or expired OTP" });
//         }

//         // Mark OTP as verified (store in database or cache)
//         await Customer.updateOne({ mobile }, { otpVerified: true }, { upsert: true });

//         // Emit OTP verification success event
//         const io = req.app.get('socketio')
//         io.emit("otp-verified", { mobile, message: "OTP verified successfully" });

//         return res.status(200).json({ message: "OTP verified successfully" });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

const createCustomer = async (req, res) => {
    try {
        const { name, email, password, mobile, latitude, longitude, address } = req.body;

        // Check if mobile number already exists
        const existingCustomer = await Customer.findOne({ mobile });
        if (existingCustomer) {
            return res.status(400).json({ message: "Mobile number already registered" });
        }

        // Generate and send OTP
        const otp = await otpService.generateOTP(mobile);
        await otpService.sendOTP(mobile, otp);

        // Emit OTP event via Socket.io
        const io = req.app.get('socketio')
        io.emit("otp-sent", { mobile, message: "OTP sent successfully" });

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new customer
        const newCustomer = new Customer({
            name,
            email,
            password: hashedPassword,
            mobile,
            location: {
                type: "Point",
                coordinates: latitude && longitude ? [longitude, latitude] : undefined,
                address: address || "",
            },
        });

        await newCustomer.save();

        // Emit customer registration event
        // const io = req.app.get('socketio')
        io.emit("customer-registered", { mobile, name, email });

        return res.status(201).json({ message: "Customer registered successfully", customer: newCustomer });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Verify OTP
// const verifyOtp = async (req, res) => {
//     try {
//         const { mobile, otp } = req.body;

//         if (!mobile || !otp) {
//             return res.status(400).json({ message: "Mobile number and OTP are required" });
//         }

//         const isOtpValid = otpService.verifyOTP(mobile, otp);

//         if (!isOtpValid) {
//             return res.status(400).json({ message: "Invalid or expired OTP" });
//         }

//         // Emit OTP verification success event
//         const io = req.app.get('socketio')
//         io.emit("otp-verified", { mobile, message: "OTP verified successfully" });

//         return res.status(200).json({ message: "OTP verified successfully" });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

// Login Customer using OTP

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

// Get Customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { customer_id } = req.params;
        const customer = await Customer.findById(customer_id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        return res.status(200).json(customer);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update Customer
const updateCustomer = async (req, res) => {
    try {
        const { customer_id } = req.params;
        const { name, email, mobile, latitude, longitude, address } = req.body;

        const updateData = { name, email, mobile,address };

        // Fetch existing customer to prevent conflicts
        const customer = await Customer.findById(customer_id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Handle location update properly
        if (latitude !== undefined && longitude !== undefined) {
            updateData.location = {
                type: "Point",
                coordinates: [longitude, latitude],
                address: address !== undefined ? address : customer.location?.address // Keep old address if not provided
            };
        } else if (address !== undefined) {
            // Update only address without affecting coordinates
            updateData["location.address"] = address;
        }

        // Perform update
        const updatedCustomer = await Customer.findByIdAndUpdate(
            customer_id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Emit customer update event
        const io = req.app.get('socketio');
        io.emit("customer-updated", { customer_id, name, email });

        return res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



// Delete Customer
const deleteCustomer = async (req, res) => {
    try {
        const { customer_id } = req.params;

        const deletedCustomer = await Customer.findByIdAndDelete(customer_id);

        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Emit customer deletion event
        const io = req.app.get('socketio')
        io.emit("customer-deleted", { customer_id });

        return res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Export All Methods
module.exports = { 
    sendOtp,
    createCustomer, 
    verifyOtp, 
    loginCustomer, 
    verifyLoginOTP, 
    getCustomerById, 
    updateCustomer, 
    deleteCustomer 
};
