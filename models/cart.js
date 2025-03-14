const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    quantity: {
        type: Number,  // INTEGER in Sequelize maps to Number in Mongoose
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCustomers",
        required: true
    },
    cartId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
