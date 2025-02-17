const sequelize = require("../util/database");
const { INTEGER, STRING } = require('sequelize')


const UserDetails = sequelize.define('user', {
    id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
    },
    password: {
        type: STRING,
        allowNull: false
    }

})

module.exports = UserDetails