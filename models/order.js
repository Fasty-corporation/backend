const sequelize = require("../util/database");
const { INTEGER, STRING, DOUBLE, JSON, TEXT } = require('sequelize')

const Order = sequelize.define('order', {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,

    },
    orderStatus: { type: STRING, defaultValue: 'Completed' },
    orderId: { type: STRING },
    totalAmount: { type: DOUBLE, allowNull: false },
    discountPercentage: { type: DOUBLE, defaultValue: 0 },
    finalAmount: { type: DOUBLE, allowNull: false },
    address: { type: JSON, allowNull: false }

})

module.exports = Order