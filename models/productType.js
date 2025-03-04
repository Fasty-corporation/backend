// const { INTEGER, STRING, DECIMAL } = require('sequelize');
// const sequelize = require('../util/database');


// const ProductType = sequelize.define('productType', {
//     id: {
//         type: INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     type: {
//         type: STRING,
//         allowNull: false
//     },
//     price: {
//         type: INTEGER,
//         allowNull: false
//     }

// });

// module.exports = ProductType;
const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
