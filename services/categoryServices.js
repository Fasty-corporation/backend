const MainCategories = require("../models/mainCategories")
const SubCategories = require("../models/subCategories")

const categorySerrvices = {
    // for creating a new category
    createCategoryService: async (name, imageUrl) => {
        try {
            const dbRes = await MainCategories.create({ name, imageUrl })
            return dbRes
        } catch (error) {
            throw error
        }
    },

    // for getting all categories
    getAllCategoriesService: async () => {
        try {
            const dbRes = await MainCategories.findAll()
            return dbRes
        } catch (error) {
            throw error
        }
    },

    // for creating a subcategory under maincategory
    createSubCategoryService: async (name, imageUrl, mainCategoryId) => {
        try {
            const dbRes = await SubCategories.create({ name, imageUrl, mainCategoryId })
            return dbRes
        } catch (error) {
            throw error
        }
    },
    // for getting all the subcategories
    getAllSubCategoriesService: async () => {
        try {
            const dbRes = await SubCategories.findAll()
            return dbRes
        } catch (error) {
            throw error
        }
    },
    findSubCategoriesService: async (mainCategoryId) => {
        try {
            const dbRes = await SubCategories.findAll({ where: { mainCategoryId } })
            return dbRes
        } catch (error) {
            throw error
        }
    }
}

module.exports = categorySerrvices