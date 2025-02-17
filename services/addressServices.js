const Address = require("../models/address")

const addressServices = {
    createAddressService: async (address, userId) => {
        try {
            const dbRes = await Address.create({ address, userId })
            return dbRes
        } catch (error) {
            throw error
        }
    },

    findUserAddressService: async (userId) => {
        try {
            const dbRes = await Address.findAll({ where: { userId } })
            return dbRes
        } catch (error) {
            throw error
        }
    }
}

module.exports = addressServices