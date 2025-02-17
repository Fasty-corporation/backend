const sequelize = require("../util/database");
const { INTEGER, JSON } = require('sequelize')

const Address = sequelize.define('address', {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    address: { type: JSON },

})



module.exports = Address