const { INTEGER, STRING, DECIMAL } = require('sequelize');
const sequelize = require('../util/database');


const SubCategories = sequelize.define('subCategories', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    imageUrl: {
        type: STRING,
        allowNull: false,
    }
});

module.exports = SubCategories;
