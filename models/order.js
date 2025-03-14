// const sequelize = require("../util/database");
// const { INTEGER, STRING, DOUBLE, JSON, TEXT } = require('sequelize')

// const Order = sequelize.define('order', {
//     id: {
//         type: INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true,

//     },
//     orderStatus: { type: STRING, defaultValue: 'Completed' },
//     orderId: { type: STRING },
//     totalAmount: { type: DOUBLE, allowNull: false },
//     discountPercentage: { type: DOUBLE, defaultValue: 0 },
//     finalAmount: { type: DOUBLE, allowNull: false },
//     address: { type: JSON, allowNull: false }

// })
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCustomers",
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    finalAmount: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["Online", "COD"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
    },
    orderStatus: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    cartItems: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],

});

module.exports = mongoose.model("Order", orderSchema);


