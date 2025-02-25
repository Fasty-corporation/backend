const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, 
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number], 
            required: true
        }
    },
    password: {
        type: String,
        required: true
    }
});

shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
