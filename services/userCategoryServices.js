const MainCategories = require("../models/mainCategories");
const ProductType = require("../models/productType");
const Product = require("../models/products");
const SubCategories = require("../models/subCategories");

const userCategoryServices = {

    getCategoryWithProductsService: async () => {
        try {
            const dbRes = await MainCategories.findAll({
                include: [{ model: Product, include: [{ model: ProductType }] }]
            })
            // parsing the images in product array  
            const categories = dbRes.map((category) => {
                category.products.forEach(product => {
                    product.imageUrls = JSON.parse(product.imageUrls);
                });
                return category;
            });

            return categories

        } catch (error) {
            throw error
        }
    },

    /**
     * 
     * @param {*} mainCategoryId 
     * @returns all the subcategory those are related to main category
     */

    getSubCategoriesService: async (mainCategoryId) => {
        try {
            const dbRes = await SubCategories.findAll({
                where: { mainCategoryId }
            })
            return dbRes

        } catch (error) {
            throw error
        }
    }
}

module.exports = userCategoryServices