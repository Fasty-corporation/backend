const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliveryBoySchema = new Schema({
  boy_id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile_number: {
    type: Number,
    required: true,
    unique: true,
    match: [/^\d{10,15}$/, "Please enter a valid mobile number"],
  },
  password: {
    type: String,
    required: true,
  },
  current_location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

DeliveryBoySchema.index({ current_location: "2dsphere" });

module.exports = mongoose.model("DeliveryBoy", DeliveryBoySchema);
