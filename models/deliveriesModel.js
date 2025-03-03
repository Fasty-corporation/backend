const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema(
  {
    delivery_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      autoIncrement: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    delivery_boy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryBoy',
      required: true,
    },
    pickup_details: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    location_history: {
      type: [
        {
          latitude: Number,
          longitude: Number,
          timestamp: Date,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Delivery', DeliverySchema);
