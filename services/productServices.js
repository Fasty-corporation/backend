const MainCategories = require("../models/mainCategories")
const ProductType = require("../models/productType")
const Product = require("../models/products")
const SubCategories = require("../models/subCategories")

const productServices = {

    // create product service 
    createProductService: async (name, imageUrls, mainCategoryId, subCategoryId, description) => {
        try {
            const dbRes = await Product.create({
                name,
                imageUrls,
                description,
                mainCategoryId,
                subCategoryId
            })
            return dbRes

        } catch (error) {
            throw error
        }
    },

    // get all product service to get all the products
    getAllProductsService: async () => {
        try {
            const dbRes = await Product.findAll({
                include: [
                    { model: MainCategories },
                    { model: SubCategories }
                ]
            })
            return dbRes
        } catch (error) {
            throw error
        }
    },

    // for creating a product type 
    createProductTypeService: async (type, price, productId) => {
        try {
            const dbRes = await ProductType.create({ type, price, productId })
            return dbRes

        } catch (error) {
            throw error
        }
    },

    // for finding a particular product by using product id 
    findProductService: async (productId) => {
        try {
            const dbRes = await Product.findOne({ where: { id: productId } })
            return dbRes
        } catch (error) {
            throw error
        }
    },

    // for fetching all the product types 
    getAllProductTypeService: async () => {
        try {
            const dbRes = await ProductType.findAll({
                include: [
                    { model: Product }
                ]
            })
            return dbRes
        } catch (error) {
            throw error
        }
    },

    // get product price service to get the product type price 
    getProductPriceService: async (productTypeId) => {
        try {
            const db = await ProductType.findOne({ where: { id: productTypeId }, attributes: ["price"] })
            return db
        } catch (error) {
            throw error
        }
    },

    // product details,service to fetch particular product details 
    getProductDetailsService: async (id) => {
        try {
            const dbRes = await Product.findOne({
                where: { id },
                include: [
                    { model: ProductType },
                    { model: MainCategories }
                ]
            })
            dbRes.imageUrls = JSON.parse(dbRes.imageUrls)
            return dbRes

        } catch (error) {
            throw error
        }
    },

    findCategoryProductsService: async (mainCategoryId, subCategoryId) => {
        try {
            if (subCategoryId == 'all') {
                const dbRes = await Product.findAll({
                    where: { mainCategoryId },
                    include: [{ model: ProductType }]

                })
                // parsing the product urls 
                dbRes.forEach((product) => {
                    product.imageUrls = JSON.parse(product.imageUrls)
                })
                return dbRes
            }

            const dbRes = await Product.findAll({
                where: { subCategoryId },
                include: [{ model: ProductType }]

            })

            // parsing the product urls 
            dbRes.forEach((product) => {
                product.imageUrls = JSON.parse(product.imageUrls)
            })
            return dbRes


        } catch (error) {
            throw error
        }
    }

}


module.exports = productServices