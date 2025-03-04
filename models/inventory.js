const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        shop_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true
        },
        shop_owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Corrected to "User" instead of "Shop"
            required: true
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MainCategories",
            required: true
        },
        sub_category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
            required: true
        },
        product_type: {
            type: String,
            enum: ["physical", "digital"],
            required: true
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        availability_status: {
            type: String,
            enum: ["in_stock", "out_of_stock"],
            required: true
        }
    },
    { timestamps: true }
);

// Middleware: Validate referenced documents before saving
inventorySchema.pre("save", async function (next) {
    try {
        const Shop = mongoose.model("Shop");
        const User = mongoose.model("User");
        const Product = mongoose.model("Product");
        const Category = mongoose.model("MainCategories");
        const SubCategory = mongoose.model("SubCategory");

        // Validate references
        const [shopExists, ownerExists, productExists, categoryExists, subCategoryExists] = await Promise.all([
            Shop.findById(this.shop_id),
            User.findById(this.shop_owner),
            Product.findById(this.product_id),
            Category.findById(this.category),
            SubCategory.findById(this.sub_category)
        ]);

        if (!shopExists) throw new Error("Shop not found");
        if (!ownerExists) throw new Error("Shop owner (User) not found");
        if (!productExists) throw new Error("Product not found");
        if (!categoryExists) throw new Error("Category not found");
        if (!subCategoryExists) throw new Error("Sub-category not found");

        next(); // Proceed with saving if all checks pass
    } catch (error) {
        next(error); // Pass the error to Mongoose
    }
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
