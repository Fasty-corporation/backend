// const sequelize = require("../util/database");
// const { INTEGER, STRING, NUMBER } = require('sequelize')

// const CreatedOffers = sequelize.define('createdoffers', {
//     id: {
//         type: INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     offerName: { type: STRING, allowNull: false },
//     minValue: { type: INTEGER, allowNull: false },
//     discount: { type: INTEGER, allowNull: false },

// })



// module.exports = CreatedOffers
const mongoose = require('mongoose');

const createdOffersSchema = new mongoose.Schema({
    offerName: {
        type: String,
        required: true
    },
    minValue: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const CreatedOffers = mongoose.model('CreatedOffers', createdOffersSchema);

module.exports = CreatedOffers;
