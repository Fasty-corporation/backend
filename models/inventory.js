const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    shop_id: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    shop_owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "MainCategories", required: true },
    sub_category: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
    product_type: { type: String, enum: ["physical", "digital"], required: true },
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    availability_status: { type: String, enum: ["in_stock", "out_of_stock"], required: true },
    verified: { type: Boolean, default: false }
}, { timestamps: true });

// Middleware: Automatically add inventory ID to the Shop's inventory array
inventorySchema.post("save", async function (doc, next) {
    try {
        await mongoose.model("Shop").updateOne(
            { _id: doc.shop_id },
            { $addToSet: { inventory: doc._id } } // Ensures no duplicate entries
        );
        next();
    } catch (error) {
        next(error);
    }
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
