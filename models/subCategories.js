// const { INTEGER, STRING, DECIMAL } = require('sequelize');
// const sequelize = require('../util/database');


// const SubCategories = sequelize.define('subCategories', {
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
//     }
// });

// module.exports = SubCategories;
const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
