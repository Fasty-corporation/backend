const { Op } = require("sequelize");
const ProductType = require("../models/productType");
const Product = require("../models/products");

const searchServices = {

    // search product service to get the products based on search string
    searchProductService: async (searchString) => {
        try {
            // Construct a regular expression pattern to match the search string
            const regexPattern = `(${searchString.split('').join('.*')})`;

            // Perform the search using regular expression
            const dbRes = await Product.findAll({
                where: {
                    name: {
                        [Op.regexp]: regexPattern
                    }
                },
                include: ProductType
            });
            return dbRes

        } catch (error) {
            throw error
        }
    }



}


module.exports = searchServices