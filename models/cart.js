const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    quantity: {
        type: Number,  // INTEGER in Sequelize maps to Number in Mongoose
        required: true
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;