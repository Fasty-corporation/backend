const mongoose = require("mongoose");
const {
    // createInventoryService,
    getInventoryDetailsService,
    findShopInventoryService,
    updateInventoryService,
    deleteInventoryService
} = require("../../services/inventoryServices");
// const mongoose = require('mongoose');
const Inventory = require('../../models/inventory');

const inventory = {
    // Create Inventory
    // const inventory = {
   createInventory: async (req, res) => {
            try {
                console.log("Request Body:", JSON.stringify(req.body, null, 2)); 

                if (!req.body || typeof req.body !== "object") {
                    return res.status(400).json({ message: "Invalid request body format" });
                }
        
                let { shop_id, product_id, quantity, availability_status } = req.body;
  
                if (typeof shop_id === "object" && shop_id !== null) {
                    ({ shop_id, product_id, quantity, availability_status } = shop_id);
                }
        

                if (!shop_id || !product_id || quantity == null || !availability_status) {
                    return res.status(400).json({ message: "All fields (shop_id, product_id, quantity, availability_status) are required" });
                }
 
                if (!mongoose.Types.ObjectId.isValid(shop_id) || !mongoose.Types.ObjectId.isValid(product_id)) {
                    return res.status(400).json({ message: "Invalid shop_id or product_id format" });
                }
        
                shop_id = new mongoose.Types.ObjectId(shop_id);
                product_id = new mongoose.Types.ObjectId(product_id);
        
                // Create Inventory
                const newInventory = new Inventory({
                    shop_id,
                    product_id,
                    quantity,
                    availability_status
                });
        
                await newInventory.save();  
        
                return res.status(201).json({ message: "Inventory created successfully", data: newInventory });
        
            } catch (error) {
                console.error("Error creating inventory:", error.message);
                return res.status(500).json({ message: "Error while creating inventory", error: error.message });
            }
        }

    // Get Inventory by ID
,    getInventoryDetails: async (req, res) => {
        try {
            const { id } = req.query;
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Valid Inventory ID is required" });
            }

            const inventory = await getInventoryDetailsService(id);
            if (!inventory) {
                return res.status(404).json({ message: "Inventory not found" });
            }

            return res.status(200).json(inventory);

        } catch (error) {
            console.error("Error finding inventory:", error.message);
            return res.status(500).json({ message: "Error while finding inventory" });
        }
    },

    // Get Inventory by Shop ID
    findShopInventory: async (req, res) => {
        try {
            const { shop_id } = req.params;  
    
            if (!shop_id || !mongoose.Types.ObjectId.isValid(shop_id)) {
                return res.status(400).json({ message: "Valid Shop ID is required" });
            }
    
            const inventoryList = await findShopInventoryService(shop_id);
    
            return res.status(200).json({ message: "Inventory retrieved", data: inventoryList });
    
        } catch (error) {
            console.error("Error retrieving shop inventory:", error.message);
            return res.status(500).json({ message: "Error while retrieving shop inventory" });
        }
    },
    

    // Update Inventory
    updateInventory: async (req, res) => {
        try {
            const { id, quantity, availability_status } = req.body;
            if (!id || !mongoose.Types.ObjectId.isValid(id) || quantity == null || !availability_status) {
                return res.status(400).json({ message: "Valid Inventory ID and update data required" });
            }

            const updatedInventory = await updateInventoryService(id, quantity, availability_status);
            if (!updatedInventory) {
                return res.status(404).json({ message: "Inventory not found" });
            }

            return res.status(200).json({ message: "Inventory updated successfully", data: updatedInventory });

        } catch (error) {
            console.error("Error updating inventory:", error.message);
            return res.status(500).json({ message: "Error while updating inventory" });
        }
    },

    // Delete Inventory
    deleteInventory: async (req, res) => {
        try {
            const { id } = req.query;
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Valid Inventory ID is required" });
            }

            const deletedInventory = await deleteInventoryService(id);
            if (!deletedInventory) {
                return res.status(404).json({ message: "Inventory not found" });
            }

            return res.status(200).json({ message: "Inventory deleted successfully" });

        } catch (error) {
            console.error("Error deleting inventory:", error.message);
            return res.status(500).json({ message: "Error while deleting inventory" });
        }
    }
};

module.exports = inventory;
