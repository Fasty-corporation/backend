const Cart = require('../models/cart')
const ProductType = require('../models/productType')
const UserDetails = require('../models/userDetails')

const userServices = {

    createUserService: async (name, email, password) => {
        try {
            const createdUser = await UserDetails.create({ name, email, password })
            return createdUser
        } catch (error) {
            throw error
        }
    },
    // get users service to find all the users from db
    getUsersService: async () => {
        try {
            const dbRes = await UserDetails.findAll()
            return dbRes

        } catch (error) {
            throw error
        }
    },
    // find user email to find specific user by their email id
    findUserByEmailService: async (email) => {
        try {
            const dbRes = await UserDetails.findOne({ where: { email: email } })
            return dbRes
        } catch (error) {
            throw error
        }
    },

    // find user service to find the user from database 
    findUserService: async (email) => {
        try {
            const dbRes = await UserDetails.findOne({
                where: { email: email },
                include: [
                    {
                        model: Cart, attributes: ["id", "quantity", "productTypeId"],
                        include: [
                            { model: ProductType, attributes: ['price'] }
                        ]
                    },


                ]
            })
            return dbRes

        } catch (error) {
            throw error
        }
    }

}


module.exports = userServices