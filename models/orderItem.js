// const sequelize = require("../util/database");
// const { INTEGER, JSON } = require('sequelize')

// const OrderItem = sequelize.define('orderitem', {
//     id: {
//         type: INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true,

//     },
//     orderDetails: {
//         type: JSON,
//         allowNull: false
//     },




// })


const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    orderDetails: {
        type: Object, // Sequelize's JSON maps to an Object in Mongoose
        required: true
    }
});

module.exports = mongoose.model("OrderItem", orderItemSchema);