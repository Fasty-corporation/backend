const deliveryBoyServices = require("../../services/deliveryBoyServices");
const Order = require("../../models/order");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Shop = require("../../models/shops");
const DeliveryBoy = require("../../models/deliveryboyModel");
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
    // Create a new delivery boy
    createDeliveryBoy: async (req, res) => {
        try {
            const { name, mobile, password, current_location } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const deliveryBoy = await deliveryBoyServices.createDeliveryBoyService(
                name, 
                mobile, 
                hashedPassword, 
                current_location
            );

            res.status(201).json({ success: true, data: deliveryBoy });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

     updateDeliveryBoy : async (req, res) => {
        try {
            const { deliveryBoy_id } = req.params;
            const { name, mobile, password, current_location } = req.body;
    
            // Fetch existing delivery boy
            const deliveryBoy = await DeliveryBoy.findById(deliveryBoy_id);
            if (!deliveryBoy) {
                return res.status(404).json({ success: false, message: "Delivery Boy not found" });
            }
    
            if (name) deliveryBoy.name = name;
            if (mobile) deliveryBoy.mobile = mobile;
            
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                deliveryBoy.password = hashedPassword;
            }
    
            // Update current location if provided
            if (current_location?.latitude && current_location?.longitude) {
                deliveryBoy.current_location = {
                    type: "Point",
                    coordinates: [current_location.longitude, current_location.latitude],
                };
            }
            await deliveryBoy.save();
    
            res.status(200).json({ success: true, message: "Profile updated successfully", data: deliveryBoy });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    

    // Get all delivery boys
    getAllDeliveryBoys: async (req, res) => {
        try {
            const deliveryBoys = await deliveryBoyServices.getDeliveryBoysService();
            res.status(200).json({ success: true, data: deliveryBoys });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get delivery boy by mobile number
    getDeliveryBoyByMobile: async (req, res) => {
        try {
            const { mobile } = req.params;
            const deliveryBoy = await deliveryBoyServices.findDeliveryBoyByMobileService(mobile);
            if (!deliveryBoy) {
                return res.status(404).json({ success: false, message: "Delivery boy not found" });
            }
            res.status(200).json({ success: true, data: deliveryBoy });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Login for Delivery Boy
    loginDeliveryBoy: async (req, res) => {
        try {
            const { mobile, boy_id, password } = req.body;
            const deliveryBoy = await DeliveryBoy.findOne({
                $or: [{ mobile }, { _id: boy_id }]
            });
            if (!deliveryBoy || !(await bcrypt.compare(password, deliveryBoy.password))) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
            const token = jwt.sign({ boy_id: deliveryBoy._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ success: true, token });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Login for Shop
    loginShop: async (req, res) => {
        try {
            const { shop_id, password } = req.body;
            const shop = await Shop.findOne({ shop_id });
            if (!shop || !(await bcrypt.compare(password, shop.password))) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
            const token = jwt.sign({ shop_id: shop.shop_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ success: true, token });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update Delivery Boy's Location (Real-Time)
    updateLocation: async (req, res) => {
        try {
            const { boy_id, latitude, longitude } = req.body;
            await DeliveryBoy.findByIdAndUpdate(boy_id, { current_location: { latitude, longitude },
              $push: { location_history: newLocation }}),
            // $push: { location_history: newLocation }

            res.status(200).json({ success: true, message: "Location updated" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Assign Order to Nearest Delivery Boy
    assignOrder: async (req, res) => {
        try {
            const { order_id } = req.body;

            // Find the order details
            const order = await Order.findById(order_id);
            if (!order) return res.status(404).json({ success: false, message: "Order not found" });

            // Find the nearest available delivery boy
            const deliveryBoys = await DeliveryBoy.find({ available: true });
            if (deliveryBoys.length === 0) return res.status(400).json({ success: false, message: "No available delivery boys" });

            // Assign the nearest delivery boy (Basic logic: first available)
            const assignedBoy = deliveryBoys[0];
            await Order.findByIdAndUpdate(order_id, { assigned_boy: assignedBoy._id, status: "Assigned" });

            res.status(200).json({ success: true, message: "Order assigned", delivery_boy: assignedBoy });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get Order Status for Shop (Real-Time Polling)
    getOrderStatus: async (req, res) => {
        try {
            const { order_id } = req.params;
            const order = await Order.findById(order_id).populate("assigned_boy");
            if (!order) return res.status(404).json({ success: false, message: "Order not found" });

            res.status(200).json({ success: true, status: order.status, delivery_boy: order.assigned_boy });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Delivery Boy Mark Order as Delivered
    markAsDelivered: async (req, res) => {
        try {
            const { order_id } = req.body;
            await Order.findByIdAndUpdate(order_id, { status: "Delivered" });

            res.status(200).json({ success: true, message: "Order marked as delivered" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // **Real-time: Wait for updates (Long Polling)**
    waitForUpdates: async (req, res) => {
        waitingClients.push({ res });
        req.on("close", () => {
            waitingClients.splice(waitingClients.indexOf(res), 1);
        });
    },

    // **Real-time: Update delivery boy location**
    updateDeliveryBoyLocation: async (req, res) => {
        try {
            const { boy_id, current_location } = req.body;
            const deliveryBoy = await DeliveryBoy.findByIdAndUpdate(
                boy_id, 
                { current_location }, 
                { new: true }
            );

            if (!deliveryBoy) {
                return res.status(404).json({ success: false, message: "Delivery boy not found" });
            }

            res.status(200).json({ success: true, data: deliveryBoy });

            // Notify waiting clients about location update
            waitingClients.forEach(client => client.res.json({ success: true, data: deliveryBoy }));
            waitingClients.length = 0;

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = deliveryBoyController;
