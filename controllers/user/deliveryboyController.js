const deliveryBoyServices = require("../../services/deliveryBoyServices");
const Order = require("../../models/order");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Shop = require("../../models/shops");
const DeliveryBoy = require("../../models/deliveryboyModel");

const deliveryBoyController = {
    // Create a new delivery boy
    createDeliveryBoy: async (req, res) => {
        try {
            const { name, mobile_number, password, current_location } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const deliveryBoy = await deliveryBoyServices.createDeliveryBoyService(
                name, 
                mobile_number, 
                hashedPassword, 
                current_location
            );

            res.status(201).json({ success: true, data: deliveryBoy });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
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
            const { mobile_number } = req.params;
            const deliveryBoy = await deliveryBoyServices.findDeliveryBoyByMobileService(mobile_number);
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
            const { mobile_number, boy_id, password } = req.body;
            const deliveryBoy = await DeliveryBoy.findOne({
                $or: [{ mobile_number }, { _id: boy_id }]
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
            await DeliveryBoy.findByIdAndUpdate(boy_id, { current_location: { latitude, longitude } });
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
