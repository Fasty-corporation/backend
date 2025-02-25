const Shop = require('../models/shops');
const bcrypt = require('bcrypt');

const shopServices = {
    // Create a new shop
    createShopService: async (name, location, password) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newShop = await Shop.create({
                name,
                location,
                password: hashedPassword
            });
            return newShop;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Get all shops
    getAllShopsService: async () => {
        try {
            return await Shop.find();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Get a shop by ID
    getShopByIdService: async (shopId) => {
        try {
            const shop = await Shop.findById(shopId);
            if (!shop) {
                throw new Error('Shop not found');
            }
            return shop;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateShopService: async (shopId, updatedData) => {
        try {
            if (updatedData.password) {
                updatedData.password = await bcrypt.hash(updatedData.password, 10);
            }
            const updatedShop = await Shop.findByIdAndUpdate(shopId, updatedData, { new: true });
            if (!updatedShop) {
                throw new Error('Shop not found');
            }
            return updatedShop;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Delete a shop by ID
    deleteShopService: async (shopId) => {
        try {
            const deletedShop = await Shop.findByIdAndDelete(shopId);
            if (!deletedShop) {
                throw new Error('Shop not found');
            }
            return { message: 'Shop deleted successfully' };
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

module.exports = shopServices;
