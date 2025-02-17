const { getCategoryWithProductsService, getSubCategoriesService } = require('../../services/userCategoryServices')

const userCategory = {
    getCategories: async (req, res) => {
        try {
            const categories = await getCategoryWithProductsService()
            return res.send(categories)

        } catch (error) {
            res.status(500).send({ message: 'Some error occured' })
        }
    },

    getCategoryByid: async (req, res) => {
        const { id } = req.query
        if (!id) {
            return res.status(500).send({ message: "error while finding subcategories" })
        }
        try {
            const subcategories = await getSubCategoriesService(id)
            return res.send(subcategories)

        } catch (error) {
            return res.status(500).send({ message: "error while finding subcategories" })
        }
    }



}


module.exports = userCategory