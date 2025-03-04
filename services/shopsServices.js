const Shop = require('../models/shops');
const bcrypt = require('bcrypt');

const shopServices = {
    // Get shop by mobile number
    getShopByMobileService: async (mobile) => {
        try {
            return await Shop.findOne({ mobile });
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    },

    // Create a new shop with hashed password
    createShopService: async (name, location, password, mobile) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newShop = new Shop({ name, location, password: hashedPassword, mobile });
            return await newShop.save();
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    },

    // Authenticate shop using ID and password
    authenticateShopService: async (shopId, password) => {
        try {
            const shop = await Shop.findById(shopId);
            if (!shop) return null;

            const isMatch = await bcrypt.compare(password, shop.password);
            return isMatch ? shop : null;
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    },

    // Get all shops
    getAllShopsService: async () => {
        try {
            return await Shop.find();
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    },

    // Get a shop by ID
    getShopByIdService: async (shopId) => {
        try {
            const shop = await Shop.findById(shopId);
            if (!shop) throw new Error('Shop not found');
            return shop;
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    },

    // Update shop details with password hashing if provided
    updateShopService: async (shopId, updatedData) => {
        try {
            if (updatedData.password) {
                updatedData.password = await bcrypt.hash(updatedData.password, 10);
            }
            const updatedShop = await Shop.findByIdAndUpdate(shopId, updatedData, { new: true });
            if (!updatedShop) throw new Error('Shop not found');
            return updatedShop;
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    },

    // Delete a shop by ID
    deleteShopService: async (shopId) => {
        try {
            const deletedShop = await Shop.findByIdAndDelete(shopId);
            if (!deletedShop) throw new Error('Shop not found');
            return { message: 'Shop deleted successfully' };
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    }
};

module.exports = shopServices;
