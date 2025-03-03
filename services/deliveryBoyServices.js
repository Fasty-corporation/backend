const DeliveryBoy = require("../models/deliveryboyModel");

const deliveryBoyServices = {
    createDeliveryBoyService: async (name, mobile, password, current_location) => {
        try {
            const createdDeliveryBoy = await DeliveryBoy.create({ name, mobile, password, current_location });
            return createdDeliveryBoy;
        } catch (error) {
            throw error;
        }
    },

    getDeliveryBoysService: async () => {
        try {
            const dbRes = await DeliveryBoy.find();
            return dbRes;
        } catch (error) {
            throw error;
        }
    },

    findDeliveryBoyByMobileService: async (mobile_number) => {
        try {
            const dbRes = await DeliveryBoy.findOne(mobile_number);
            return dbRes;
        } catch (error) {
            throw error;
        }
    },

    findDeliveryBoyService: async (mobile_number) => {
        try {
            const dbRes = await DeliveryBoy.findOne({ where: { mobile_number: mobile_number } });
            return dbRes;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = deliveryBoyServices;
