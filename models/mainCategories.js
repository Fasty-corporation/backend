// const { INTEGER, STRING } = require('sequelize');
// const sequelize = require('../util/database');

// const MainCategories = sequelize.define('mainCategories', {
//     id: {
//         type: INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     name: {
//         type: STRING,
//         allowNull: false,
//     },
//     imageUrl: {
//         type: STRING,
//         allowNull: false,
//     },
// });

// module.exports = MainCategories;
const mongoose = require('mongoose');

const mainCategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

const MainCategories = mongoose.model('MainCategories', mainCategoriesSchema);

module.exports = MainCategories;
