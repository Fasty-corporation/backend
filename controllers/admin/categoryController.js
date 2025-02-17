const { createCategoryService, getAllCategoriesService, createSubCategoryService, getAllSubCategoriesService } = require('../../services/categoryServices')
const { getSubCategoriesService } = require('../../services/userCategoryServices')

const categoryController = {

    // to add main category 
    addCategory: async (req, res) => {

        const { name, imageUrl } = req.body
        if (!name || !imageUrl) {
            return res.status(400).send({ message: "error while creating category" })
        }
        try {
            const dbRes = await createCategoryService(name, imageUrl)
            const data = { message: "Category added", name, imageUrl, id: dbRes.id }
            return res.send(data)

        } catch (error) {
            res.status(400).send({ message: 'Error! while creating category' })
        }


    },

    // get all categories
    getAllCategories: async (req, res) => {
        try {
            const dbRes = await getAllCategoriesService()
            return res.send(dbRes)

        } catch (error) {
            res.status(400).send({ message: 'Something went wrong' })
        }
    },



    // for adding a subcategory
    addSubCategory: async (req, res) => {
        const { name, imageUrl, categoryId } = req.body

        if (!name || !imageUrl || !categoryId) {
            return res.status(500).send({ message: "error ! while creating subcategory" })
        }
        try {
            const dbRes = await createSubCategoryService(name, imageUrl, categoryId)
            const addedSubCategory = {
                name,
                imageUrl,
                id: dbRes.id,
                mainCategoryId: categoryId
            }
            return res.send(addedSubCategory)

        } catch (error) {
            res.status(400).send({ message: "error ! while creating subcategory" })
        }

    },

    // for getting all the subcategories 
    getAllSubCategories: async (req, res) => {
        try {
            const dbRes = await getAllSubCategoriesService()
            return res.send(dbRes)
        } catch (error) {
            res.status(500).send({ message: "error while gettng subcategories" })
        }
    },

    getSubCategoriesByMainCategory: async (req, res) => {
        const { id } = req.query
        if (!id) {
            return res.status(500).send({ message: "error while gettng subcategories" })
        }
        try {
            const subCategories = await getSubCategoriesService(id)
            return res.send(subCategories)
        }
        catch (error) {
            res.status(500).send({ message: "error while gettng subcategories" })

        }

    }




}


module.exports = categoryController