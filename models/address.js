const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address: {
        type: Object,  // JSON in Sequelize can be stored as an Object in Mongoose
        required: true
    }
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;