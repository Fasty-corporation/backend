const { INTEGER, STRING, DOUBLE, UUID } = require('sequelize');
const sequelize = require('../util/database');


const Transaction = sequelize.define('transaction', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderId: {
        type: STRING
    },
    paymentId: {
        type: STRING,

    },
    status: {
        type: STRING,
        defaultValue: 'pending'
    },
    amount: {
        type: STRING,
        allowNull: false
    },

    userEmail: {
        type: STRING,
        allowNull: false
    }
});

module.exports = Transaction;
