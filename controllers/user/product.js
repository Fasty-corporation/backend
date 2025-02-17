const { getProductDetailsService, findCategoryProductsService } = require('../../services/productServices')

const product = {
    getProductDetails: async (req, res) => {
        const { id } = req.query
        if (!id) {
            return res.status(500).send({ message: 'error while finding product' })
        }
        try {
            const dbRes = await getProductDetailsService(id)
            return res.send(dbRes)

        } catch (error) {
            res.status(500).send({ message: 'error while finding product' })
        }
    },

    getProductBySubCategory: async (req, res) => {
        let { subid, id } = req.query
        if (!subid || !id) {
            return res.status(500).send({ message: "error while finding products" })
        }
        try {
            const findedProduct = await findCategoryProductsService(id, subid)
            return res.send(findedProduct)

        } catch (error) {
            res.status(500).send({ message: "error while finding products" })
        }
    }
}


module.exports = product