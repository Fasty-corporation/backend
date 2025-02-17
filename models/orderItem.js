const sequelize = require("../util/database");
const { INTEGER, JSON } = require('sequelize')

const OrderItem = sequelize.define('orderitem', {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,

    },
    orderDetails: {
        type: JSON,
        allowNull: false
    },




})



module.exports = OrderItem