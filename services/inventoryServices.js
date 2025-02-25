const Inventory  = require('../models/inventory');

const inventoryServices = {
    // Create a new inventory entry
    createInventoryService: async (shop_id, product_id, quantity, availability_status) => {
        try {
            return await Inventory.create({ shop_id, product_id, quantity, availability_status });
        } catch (error) {
            throw new Error(`Error creating inventory: ${error.message}`);
        }
    },

    // Get inventory details by ID
    getInventoryDetailsService: async (id) => {
        try {
            const inventory = await Inventory.findById(id, {
                // include: ['shop', 'product']
            });
            if (!inventory) throw new Error('Inventory not found');
            return inventory;
        } catch (error) {
            throw new Error(`Error fetching inventory details: ${error.message}`);
        }
    },

    // Get inventory by Shop ID
     findShopInventoryService: async (shop_id) => {
        try {
            return await Inventory.findAll({
                where: { shop_id },  
                include: [{ model: Product }] 
            });
        } catch (error) {
            throw new Error(`Error fetching shop inventory: ${error.message}`);
        }
    },
    

    // Update inventory by ID
    updateInventoryService: async (id, updates) => {
        try {
            const inventory = await Inventory.findById(id);
            if (!inventory) throw new Error('Inventory not found');
            
            await inventory.updateOne(updates);
            return inventory;
        } catch (error) {
            throw new Error(`Error updating inventory: ${error.message}`);
        }
    },

    // Delete inventory by ID
    deleteInventoryService: async (id) => {
        try {
            const inventory = await Inventory.findById(id);
            if (!inventory) throw new Error('Inventory not found');
            
            await inventory.deleteOne();
            return { message: 'Inventory deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting inventory: ${error.message}`);
        }
    }
};

module.exports = inventoryServices;
