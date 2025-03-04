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



// module.exports = OrderItem

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    orderDetails: {
        type: Object, // Sequelize's JSON maps to an Object in Mongoose
        required: true
    }
}, { timestamps: true });

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;
