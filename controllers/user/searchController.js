const { searchProductService } = require("../../services/searchServices")

const searchController = {
    getSearchProduct: async (req, res) => {
        const { s } = req.query
        try {
            if (!s) {
                return res.status(500).send({ message: 'search string missing' })
            }
            const searchProducts = await searchProductService(s)
            res.send(searchProducts)
        } catch (error) {
            res.status(500).send({ message: "Error while searching products" })
        }
    }
}

module.exports = searchController