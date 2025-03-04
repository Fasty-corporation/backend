const UserDetails = require('../models/userDetails');
const Cart = require('../models/cart');
const ProductType = require('../models/productType');

const userServices = {
    // Create user service
    createUserService: async (name, email, password) => {
        try {
            const createdUser = await UserDetails.create({ name, email, password });
            return createdUser;
        } catch (error) {
            throw error;
        }
    },

    // Get all users from MongoDB
    getUsersService: async () => {
        try {
            const dbRes = await UserDetails.find({});
            return dbRes;
        } catch (error) {
            throw error;
        }
    },

    // Find user by email
    findUserByEmailService: async (email) => {
        try {
            const dbRes = await UserDetails.findOne({ email });
            return dbRes;
        } catch (error) {
            throw error;
        }
    },

    // Find user with cart and product type details
    findUserService: async (email) => {
        try {
            const dbRes = await UserDetails.findOne({ email })
                // .populate({
                //     // path: "cart",
                //     select: "id quantity productType",
                //     populate: {
                //         path: "productType",
                //         select: "price",
                //     },
                // });

            return dbRes;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = userServices;
