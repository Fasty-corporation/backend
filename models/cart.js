const sequelize = require("../util/database");
const { INTEGER } = require('sequelize')

const Cart = sequelize.define('cart', {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: { type: INTEGER },

})



module.exports = Cart