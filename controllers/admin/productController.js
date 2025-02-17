const { createProductService,
    getAllProductsService,
    createProductTypeService,
    findProductService,
    getAllProductTypeService } = require('../../services/productServices')

// for add a new product 
const productController = {
    addProduct: async (req, res) => {
        const { name, imageUrls, mainCategoryId, subCategoryId, description } = req.body
        if (!name || !imageUrls || !mainCategoryId || !subCategoryId || !description) {
            return res.status(500).send({ message: "Error ! while creating product" })
        }
        try {
            const jsonImages = JSON.stringify(imageUrls)
            const dbRes = await createProductService(
                name,
                jsonImages,
                mainCategoryId,
                subCategoryId,
                description)

            return res.send({ id: dbRes.id, message: "Success" })

        } catch (error) {
            res.status(500).send({ message: "Error ! while creating product" })

        }

    },


    // for fetching all the products 
    getAllProduct: async (req, res) => {
        try {
            const dbRes = await getAllProductsService()
            return res.send(dbRes)

        } catch (error) {
            res.status(500).send({ message: 'Some error occured while fetching products' })
        }
    },


    // for adding a product type
    addProductType: async (req, res) => {
        const { type, price, productId } = req.body
        if (!type || !price || !productId) {
            res.status(500).send({ message: "error creating product type(some fields are blank) " })
        }
        try {
            const dbRes = await createProductTypeService(type, price, productId)
            const findProduct = await findProductService(productId)

            const sendRes = {
                id: dbRes.id,
                productName: findProduct.name,
                productId: findProduct.id,
                type: type,
                price: price
            }

            return res.send(sendRes)

        } catch (error) {
            res.status(500).send({ message: 'error while creating product type' })
        }

    },

    // for getting all the product types
    getAllProductTypes: async (req, res) => {
        try {
            const dbRes = await getAllProductTypeService()
            return res.send(dbRes)
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = productController