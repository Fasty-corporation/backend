const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
       customer_id: {
            type: mongoose.Schema.Types.ObjectId, // MongoDB auto-generates `_id`
            alias: "_id"
        },
        name: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
            sparse: true
        },
        password: {
            type: String,
            required: false
        },
       mobile: {
        type: String,
        required: true,
        unique: true,
        sparse: false // Null value ki duplicate error avoid karne ke liye
       },
       address:{
        type:String,
        required:false
       },
       productId : {
        type:mongoose.Schema.Types.ObjectId,
        ref : "Product"
       }
}, { timestamps: true });

// customerSchema.index({ location: "2dsphere" }); // Enables geospatial queries

module.exports= mongoose.model("UserCustomers", customerSchema);
// module.exports = Customer;
