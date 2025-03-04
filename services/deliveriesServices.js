const Delivery = require('../models/deliveriesModel');

const deliveryService = {
  createDelivery: async (data) => {
    try {
      return await Delivery.create(data);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getAllDeliveries: async () => {
    try {
      return await Delivery.find().populate('order_id delivery_boy_id');
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getDeliveryById: async (id) => {
    try {
      const delivery = await Delivery.findById(id).populate('order_id delivery_boy_id');
      if (!delivery) throw new Error('Delivery not found');
      return delivery;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateDelivery: async (id, data) => {
    try {
      const updatedDelivery = await Delivery.findByIdAndUpdate(id, data, { new: true });
      if (!updatedDelivery) throw new Error('Delivery not found');
      return updatedDelivery;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteDelivery: async (id) => {
    try {
      const deletedDelivery = await Delivery.findByIdAndDelete(id);
      if (!deletedDelivery) throw new Error('Delivery not found');
      return { message: 'Delivery deleted successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = deliveryService;
