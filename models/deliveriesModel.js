const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema(
  {
    delivery_id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    delivery_boy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      required: true,
    },
    pickup_details: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Picked Up", "In Transit", "Delivered", "Cancelled"],
      default: "Pending",
    },
    location_history: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Delivery = mongoose.model("Delivery", DeliverySchema);

module.exports = Delivery;
