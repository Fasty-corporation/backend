// const sequelize = require("../util/database");
// const { INTEGER, STRING } = require('sequelize')


// const UserDetails = sequelize.define('user', {
//     id: {
//         type: INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     name: {
//         type: STRING,
//         allowNull: false,
//     },
//     email: {
//         type: STRING,
//         allowNull: false,
//     },
//     password: {
//         type: STRING,
//         allowNull: false
//     }

// })

// module.exports = UserDetails
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
