// const { INTEGER, STRING, DOUBLE, UUID } = require('sequelize');
// const sequelize = require('../util/database');


// const Transaction = sequelize.define('transaction', {
//     id: {
//         type: INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     orderId: {
//         type: STRING
//     },
//     paymentId: {
//         type: STRING,

//     },
//     status: {
//         type: STRING,
//         defaultValue: 'pending'
//     },
//     amount: {
//         type: STRING,
//         allowNull: false
//     },

//     userEmail: {
//         type: STRING,
//         allowNull: false
//     }
// });

// module.exports = Transaction;
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    amount: {
        type: String, // If amount should support decimals, use Number instead
        required: true
    },
    userEmail: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
