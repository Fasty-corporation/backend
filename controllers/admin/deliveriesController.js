const { validationResult } = require('express-validator');
const deliveryService = require('../../services/deliveriesServices');
const deliveryBoyService = require('../../services/deliveryBoyService.js'); // Service for delivery boys
const WebSocket = require('../../utils/websocket.js'); // WebSocket utility

const deliveryController = {
  create: async (req, res) => {
    try {
      // Step 1: Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { shopLocation, items } = req.body;

      // Step 2: Fetch nearby available delivery boys (1-3 km radius)
      const nearbyDeliveryBoys = await deliveryBoyService.findNearbyAvailableDeliveryBoys(shopLocation, 3);
      if (!nearbyDeliveryBoys.length) {
        return res.status(400).json({ error: "No available delivery boys nearby" });
      }

      // Step 3: Select the closest available delivery boy
      const assignedDeliveryBoy = nearbyDeliveryBoys[0]; // Closest delivery boy

      // Step 4: Save delivery details
      const deliveryData = {
        deliveryBoyId: assignedDeliveryBoy.id,
        pickupDetails: items,
        status: 'assigned',
      };
      const delivery = await deliveryService.createDelivery(deliveryData);

      // Step 5: Notify the delivery boy via WebSocket
      const message = `New Order Assigned: Pick up ${items.map(item => `${item.quantity} ${item.name}`).join(', ')} from shops.`;
      WebSocket.sendNotification(assignedDeliveryBoy.id, message);

      res.status(201).json({ message: "Delivery created and assigned successfully", data: delivery });
    } catch (error) {
      console.log(error)
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
