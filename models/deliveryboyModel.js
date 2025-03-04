const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliveryBoySchema = new Schema({
  boy_id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: false,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
    match: [/^\d{10,15}$/, "Please enter a valid mobile number"],
  },
  password: {
    type: String,
    required: false,
  },
  current_location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required : false
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  location_history: [
    {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now }
    }
]
});

DeliveryBoySchema.index({ current_location: "2dsphere" });

module.exports = mongoose.model("DeliveryBoy", DeliveryBoySchema);
