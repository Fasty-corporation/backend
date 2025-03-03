const { validationResult } = require('express-validator');
const deliveryService = require('../../services/deliveriesServices');

const deliveryController = {
  create: async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Create new delivery
      const delivery = await deliveryService.createDelivery(req.body);
      res.status(201).json({ message: 'Delivery created successfully', data: delivery });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const deliveries = await deliveryService.getAllDeliveries();
      res.status(200).json(deliveries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const delivery = await deliveryService.getDeliveryById(req.params.id);
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery not found' });
      }
      res.status(200).json(delivery);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const delivery = await deliveryService.updateDelivery(req.params.id, req.body);
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery not found' });
      }
      res.status(200).json({ message: 'Delivery updated successfully', data: delivery });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletedelivery: async (req, res) => {
    try {
      const response = await deliveryService.deleteDelivery(req.params.id);
      if (!response) {
        return res.status(404).json({ error: 'Delivery not found' });
      }
      res.status(200).json({ message: 'Delivery deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = deliveryController;
