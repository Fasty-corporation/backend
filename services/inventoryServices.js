const Inventory  = require('../models/inventory');

const inventoryServices = {
    // Create a new inventory entry
        createInventory: async (shop_id, shop_owner, product_id, category, sub_category, product_type, stock, price, availability_status) => {
            try {
                const newInventory = new Inventory({
                    shop_id,
                    shop_owner,
                    product_id,
                    category,
                    sub_category,
                    product_type,
                    stock,
                    price,
                    availability_status
                });
    
                return await newInventory.save();
            } catch (error) {
                throw new Error(`Error creating inventory: ${error.message}`);
            }
        },
         verifyInventoryService : async (inventoryId) => {
            try {
                const updatedInventory = await Inventory.findByIdAndUpdate(
                    inventoryId,
                    { verified: true },
                    { new: true }
                );
                return updatedInventory;
            } catch (error) {
                throw new Error("Error while verifying inventory");
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
