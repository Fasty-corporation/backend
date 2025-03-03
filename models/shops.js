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
    owner_name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        pincode: {
            type: String,
            required: true,
            trim: true
        },
        landmark: {
            type: String,
            trim: true
        }
    },
    gst: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
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
    verify: {
        otp: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    profile: {
        account_details: {
            bank: {
                type: String,
                required: true,
                trim: true
            },
            ifsc: {
                type: String,
                required: true,
                trim: true
            },
            ac_number: {
                type: String,
                required: true,
                trim: true
            }
        },
        pan: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        aadhaar: {
            type: String,
            required: true,
            unique: true,
            trim: true
        }
    }
}, { timestamps: true });

shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
