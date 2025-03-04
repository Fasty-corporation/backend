// const sequelize = require("../util/database");
// const { INTEGER } = require('sequelize')

// const GivenOffers = sequelize.define('givenoffers', {
//     id: {
//         type: INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
// })



// module.exports = GivenOffers
const mongoose = require('mongoose');

const givenOffersSchema = new mongoose.Schema({}, { timestamps: true });

const GivenOffers = mongoose.model('GivenOffers', givenOffersSchema);

module.exports = GivenOffers;
