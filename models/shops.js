const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
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
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Inventory" }],
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
    // location: {
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         required: true,
    //         default: 'Point'
    //     },
    //     coordinates: {
    //         type: [Number], 
    //         required: true
    //     }
    // },
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
                required: false,
                trim: true
            },
            ifsc: {
                type: String,
                required: false,
                trim: true
            },
            ac_number: {
                type: String,
                required: false,
                trim: true
            }
        },
        pan: {
            type: String,
            required: false,
            unique: true,
            trim: true
        },
        aadhaar: {
            type: String,
            required: false,
            unique: true,
            trim: true
        }
    },
    // owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    // inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Inventory" }]
}, { timestamps: true });

shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
