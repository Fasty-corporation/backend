const { INTEGER, STRING } = require('sequelize');
const sequelize = require('../util/database');

const MainCategories = sequelize.define('mainCategories', {
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
    },
});

module.exports = MainCategories;
