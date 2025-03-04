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

// module.exports = Order
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderStatus: {
        type: String,
        default: 'Completed'
    },
    orderId: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    finalAmount: {
        type: Number,
        required: true
    },
    address: {
        type: Object, // Sequelize's JSON maps to an Object in Mongoose
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
