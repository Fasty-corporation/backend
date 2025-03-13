const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    // customer_id: {
    //     type: mongoose.Schema.Types.ObjectId, // MongoDB auto-generates `_id`
    //     alias: "_id"
    // },
    // name: {
    //     type: String,
    //     required: false
    // },
    // email: {
    //     type: String,
    //     required: false,
    //     unique: true,
    //     lowercase: true,
    //     trim: true,
    //     match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    //     sparse: true
    // },
    // password: {
    //     type: String,
    //     required: false
    // },
    mobile: {
        type: String,
        required: true,
        unique: true,
        sparse: false // Null value ki duplicate error avoid karne ke liye
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
            required: false
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: undefined,
            required:false // Allows saving null if the user has no location
        },
        address: {
            type: String,
            default: "" // Allows the user to enter a manual address
        }
    }
}, { timestamps: true });

customerSchema.index({ location: "2dsphere" }); // Enables geospatial queries

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
