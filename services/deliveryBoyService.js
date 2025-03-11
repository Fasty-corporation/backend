const DeliveryBoy = require('../models/deliveryboyModel'); // Sequelize model

const deliveryBoyService = {
  findNearbyAvailableDeliveryBoys: async (shopLocation, radiusKm) => {
    return await DeliveryBoy.findAll({
      where: {
        status: 'available',
        location: {
          [Op.near]: [shopLocation.lat, shopLocation.lng, radiusKm * 1000], // Example geospatial query
        },
      },
      order: [['distance', 'ASC']], // Sort by closest
    });
  },
};

module.exports = deliveryBoyService;
