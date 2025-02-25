const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop", 
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", 
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    availability_status: {
        type: String,
        enum: ["in_stock", "out_of_stock"],
        required: true
    }
}, { timestamps: true }); 

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
