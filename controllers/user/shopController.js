const shopServices = require('../../services/shopsServices');
const jwt = require("jsonwebtoken");
const otpService = require("../../services/otpService");
const bcrypt = require("bcrypt");
const Shop = require("../../models/shops");
const Inventory = require("../../models/inventory");
const mongoose = require("mongoose");
// const Shop = require("../models/Shop");
// const Inventory = require("../../models/Inventory");
const shopController = {
    // Create a new shop with OTP verification
    createShop: async (req, res) => {
        try {
            const { name, mobile, owner_name, address, gst,inventory } = req.body;
            if (!name   || !mobile || !owner_name || !address || !gst) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            
            // Check if shop already exists
            const existingShop = await Shop.findOne({ mobile });
            if (existingShop) {
                return res.status(400).json({ message: 'Shop with this mobile number already exists' });
            }
            
            // Generate and send OTP
            const otp = await otpService.generateOTP(mobile);
            await otpService.sendOTP(mobile, otp);
            req.app.get('socketio').emit("shop:create:otpSent", { mobile, message: "OTP sent successfully" });
            
            // const hashedPassword = await bcrypt.hash(password, 10);
            const newShop = new Shop({
                name,
                owner_name,
                address,
                gst,
                inventory,
                // password: hashedPassword,
                mobile,
                // location,
                verify: { otp, verified: false }
            });
            await newShop.save();

            return res.status(200).json({ message: 'OTP sent to mobile number', mobile , newShop});
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    verifyOtp: async (req, res) => {
        try {
            const { mobile, otp } = req.body;
            if (!mobile || !otp) {
                return res.status(400).json({ message: "Mobile number and OTP are required" });
            }
    
            const shop = await Shop.findOne({ mobile });
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            
            const isValid = otpService.verifyOTP(mobile, otp);
            if (!isValid) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }
            
            shop.verify.verified = true;
            await shop.save();
            req.app.get('socketio').emit("shop:verifyOtp", { mobile, message: "OTP verified successfully" });
            
            return res.status(200).json({ message: "OTP verified successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    loginShop: async (req, res) => {
        try {
            const { mobile } = req.body;
            if (!mobile) {
                return res.status(400).json({ message: 'Mobile number is required' });
            }
    
            const shop = await Shop.findOne({ mobile });
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
    
            const otp = await otpService.generateOTP(mobile);
            await otpService.sendOTP(mobile, otp);
            req.app.get('socketio').emit("shop:login:otpSent", { mobile, message: "OTP sent for login" });
            return res.status(200).json({ message: 'OTP sent to mobile number' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    verifyLoginOTP: async (req, res) => {
        try {
            const { mobile, otp } = req.body;
            if (!mobile || !otp) {
                return res.status(400).json({ message: 'Mobile number and OTP are required' });
            }
    
            const isOtpValid = otpService.verifyOTP(mobile, otp);
            if (!isOtpValid) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }
    
            const shop = await Shop.findOne({ mobile });
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
    
            const token = jwt.sign(
                { shopId: shop._id, name: shop.name },
                process.env.JWT_SECRET || 'your_secret_key',
                { expiresIn: '1h' }
            );
            req.app.get('socketio').emit("shop:login:success", { mobile, message: "Shop logged in successfully" });
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // getAllShops: async (req, res) => {
    //     try {
    //         const shops = await Shop.find();
    //         req.app.get('socketio').emit("shop:getAll", { message: "All shops retrieved" });
    //         return res.status(200).json(shops);
    //     } catch (error) {
    //         return res.status(500).json({ message: error.message });
    //     }
    // },
  
    

    getAllShops: async (req, res) => {
        try {
            const shops = await Shop.find()
                .populate({
                    path: "inventory",
                    model: "Inventory",
                    populate: {
                        path: "product_id category sub_category",
                        select: "name",
                        select:"imageUrl"
                    }
                })
                .select("-__v");
    
            if (!shops.length) {
                return res.status(404).json({
                    success: false,
                    message: "No shops found"
                });
            }
    
            // ✅ Add inventory count for each shop
            const shopsWithInventoryCount = shops.map(shop => ({
                ...shop.toObject(),
                inventoryCount: shop.inventory ? shop.inventory.length : 0
            }));
    
            return res.status(200).json({
                success: true,
                message: "Shops with inventory retrieved successfully",
                shops: shopsWithInventoryCount
            });
        } catch (error) {
            console.error("Error fetching shops:", error.message);
            return res.status(500).json({
                success: false,
                message: "Error while fetching shops",
                error: error.message
            });
        }
    },    

    // getAllShops: async (req, res) => {
    //     try {
    //         const shops = await Shop.find();
            
    //         const shopsWithInventory = await Promise.all(shops.map(async (shop) => {
    //             const inventories = await Inventory.find({ shopId: shop._id });
    //             return { ...shop.toObject(), inventories };
    //         }));
    
    //         return res.status(200).json(shopsWithInventory);
    //     } catch (error) {
    //         return res.status(500).json({ message: error.message });
    //     }
    // },  
    getShopById: async (req, res) => {
        try {
            const { shopId } = req.params;
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            req.app.get('socketio').emit("shop:getById", { shopId, message: "Shop details retrieved" });
            return res.status(200).json(shop);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    updateShop: async (req, res) => {
        try {
            const { shopId } = req.params;
            const updatedData = req.body;
            const updatedShop = await Shop.findByIdAndUpdate(shopId, updatedData, { new: true });
            if (!updatedShop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            req.app.get('socketio').emit("shop:update", { shopId, message: "Shop updated successfully" });
            return res.status(200).json(updatedShop);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    deleteShop: async (req, res) => {
        try {
            const { shopId } = req.params;
            const deletedShop = await Shop.findByIdAndDelete(shopId);
            if (!deletedShop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            req.app.get('socketio').emit("shop:delete", { shopId, message: "Shop deleted successfully" });
            return res.status(200).json({ message: 'Shop deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    createOrUpdateShopProfile : async (req, res) => {
        try {
            const { shopId } = req.params;
            const { bank, ifsc, ac_number, pan, aadhaar } = req.body;
    
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
    
            shop.profile = {
                account_details: { bank, ifsc, ac_number },
                pan,
                aadhaar
            };
    
            await shop.save();
    
            res.status(200).json({ message: 'Shop profile updated successfully', profile: shop.profile });
        } catch (error) {
            res.status(500).json({ message: 'Error updating shop profile', error: error.message });
        }
    },
    // Get Shop Profile
    getShopProfile : async (req, res) => {
        try {
            const { shopId } = req.params;
    
            const shop = await Shop.findById(shopId, 'profile');
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
    
            res.status(200).json({ profile: shop.profile });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching shop profile', error: error.message });
        }
    }
    ,
    // Delete Shop Profile
    deleteShopProfile : async (req, res) => {
        try {
            const { shopId } = req.params;
    
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
    
            shop.profile = {}; // Remove profile data
            await shop.save();
    
            res.status(200).json({ message: 'Shop profile deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting shop profile', error: error.message });
        }
    }
};

module.exports = shopController;
