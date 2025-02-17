const { INTEGER, STRING, JSON } = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    imageUrls: {
        type: JSON,
        allowNull: false,
    },
    description: {
        type: STRING,
        allowNull: true
    }
});

module.exports = Product;
