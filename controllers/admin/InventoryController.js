const mongoose = require("mongoose");
const {
    
    getInventoryDetailsService,
    findShopInventoryService,
    updateInventoryService,
    deleteInventoryService,
    createInventory,
    verifyInventoryService
} = require("../../services/inventoryServices");
const Inventory = require('../../models/inventory');
//
const inventoryController = {
    // Create Inventory
    createInventory: async (req, res) => {
        try {
            console.log("Request Body:", JSON.stringify(req.body, null, 2));

            if (!req.body || typeof req.body !== "object") {
                return res.status(400).json({ message: "Invalid request body format" });
            }

            let { shop_id, shop_owner, product_id, category, sub_category, product_type, stock, price, availability_status } = req.body;

            if (!shop_id || !shop_owner || !product_id || !category || !sub_category || !product_type || stock == null || price == null || !availability_status) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Validate MongoDB Object IDs
            if (!mongoose.isValidObjectId(shop_id)) {
                return res.status(400).json({ message: "Invalid shop_id format" });
            }
            if (!mongoose.isValidObjectId(shop_owner)) {
                return res.status(400).json({ message: "Invalid shop_owner format" });
            }
            if (!mongoose.isValidObjectId(product_id)) {
                return res.status(400).json({ message: "Invalid product_id format" });
            }
            if (!mongoose.isValidObjectId(category)) {
                return res.status(400).json({ message: "Invalid category format" });
            }
            if (!mongoose.isValidObjectId(sub_category)) {
                return res.status(400).json({ message: "Invalid sub_category format" });
            }

            // Call service to create inventory
            const newInventory = await createInventory(
                shop_id, shop_owner, product_id, category, sub_category, product_type, stock, price, availability_status
            );

            return res.status(201).json({ message: "Inventory created successfully", data: newInventory });

        } catch (error) {
            console.error("Error creating inventory:", error.message);
            return res.status(500).json({ message: "Error while creating inventory", error: error.message });
        }
    },
     getAllInventory: async (req, res) => {
            try {
                const inventoryList = await findShopInventoryService();
    
                if (!inventoryList || inventoryList.length === 0) {
                    return res.status(404).json({ message: "No inventory records found" });
                }
    
                return res.status(200).json({
                    message: "Inventory retrieved successfully",
                    data: inventoryList,
                });
    
            } catch (error) {
                console.error("Error fetching inventory:", error.message);
                return res.status(500).json({ message: "Error while fetching inventory", error: error.message });
            }
        },
     verifyInventory : async (req, res) => {
            try {
                const { inventoryId } = req.params;
        
                if (!mongoose.isValidObjectId(inventoryId)) {
                    return res.status(400).json({ message: "Invalid inventory ID format" });
                }
        
                const updatedInventory = await verifyInventoryService(inventoryId);
        
                if (!updatedInventory) {
                    return res.status(404).json({ message: "Inventory not found or already verified" });
                }
        
                return res.status(200).json({ message: "Inventory verified successfully", data: updatedInventory });
            } catch (error) {
                console.error("Error verifying inventory:", error.message);
                return res.status(500).json({ message: "Error while verifying inventory", error: error.message });
            }
    },
    // Get Inventory by ID
    getInventoryDetails: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Valid Inventory ID is required" });
            }

            const inventory = await getInventoryDetailsService(id);
            if (!inventory) {
                return res.status(404).json({ message: "Inventory not found" });
            }

            return res.status(200).json({ message: "Inventory details retrieved", data: inventory });

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
            const { id, shop_id, shop_owner, product_id, category, sub_category, product_type, stock, price, availability_status } = req.body;

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Valid Inventory ID is required" });
            }

            if (!shop_id || !shop_owner || !product_id || !category || !sub_category || !product_type || stock == null || price == null || !availability_status) {
                return res.status(400).json({ message: "All fields are required for update" });
            }

            const updatedInventory = await updateInventoryService(id, {
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
            const { id } = req.params;
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

module.exports = inventoryController;
