const shopServices = require('../../services/shopsServices');

const shopController = {
    // Create a new shop
    createShop: async (req, res) => {
        try {
            const { name, location, password } = req.body;
            if (!name || !location || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const newShop = await shopServices.createShopService(name, location, password);
            return res.status(201).json(newShop);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Get all shops
    getAllShops: async (req, res) => {
        try {
            const shops = await shopServices.getAllShopsService();
            return res.status(200).json(shops);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Get a shop by ID
    getShopById: async (req, res) => {
        try {
            const { shopId } = req.params;
            if (!shopId) {
                return res.status(400).json({ message: 'Shop ID is required' });
            }
            const shop = await shopServices.getShopByIdService(shopId);
            return res.status(200).json(shop);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Update a shop
    updateShop: async (req, res) => {
        try {
            const { shopId } = req.params;
            const updatedData = req.body;
            if (!shopId) {
                return res.status(400).json({ message: 'Shop ID is required' });
            }
            const updatedShop = await shopServices.updateShopService(shopId, updatedData);
            return res.status(200).json(updatedShop);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Delete a shop
    deleteShop: async (req, res) => {
        try {
            const { shopId } = req.params;
            if (!shopId) {
                return res.status(400).json({ message: 'Shop ID is required' });
            }
            const result = await shopServices.deleteShopService(shopId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

module.exports = shopController;
