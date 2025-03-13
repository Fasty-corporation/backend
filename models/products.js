// const { INTEGER, STRING, JSON } = require('sequelize');
// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//     id: {
//         type: INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     name: {
//         type: STRING,
//         allowNull: false,
//     },
//     imageUrls: {
//         type: JSON,
//         allowNull: false,
//     },
//     description: {
//         type: STRING,
//         allowNull: true
//     }
// });

// module.exports = Product;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrls: {
        type: String, // Sequelize's JSON is mapped to an array of strings for images
        required: true
    },
    description: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
