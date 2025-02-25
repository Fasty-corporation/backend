const { 
    createCategoryService, 
    getAllCategoriesService, 
    createSubCategoryService, 
    getAllSubCategoriesService, 
    updateCategoryService, 
    deleteCategoryService, 
    updateSubCategoryService, 
    deleteSubCategoryService 
} = require('../../services/categoryServices')
const { getSubCategoriesService } = require('../../services/userCategoryServices')

const categoryController = {
    // Add main category
    addCategory: async (req, res) => {
        const { name, imageUrl } = req.body;
        if (!name || !imageUrl) {
            return res.status(400).send({ message: "Error while creating category" });
        }
        try {
            const dbRes = await createCategoryService(name, imageUrl);
            return res.send({ message: "Category added", id: dbRes.id, name, imageUrl });
        } catch (error) {
            res.status(400).send({ message: 'Error! while creating category' });
        }
    },

    // Get all categories
    getAllCategories: async (req, res) => {
        try {
            const dbRes = await getAllCategoriesService();
            return res.send(dbRes);
        } catch (error) {
            res.status(400).send({ message: 'Something went wrong' });
        }
    },

    // Edit category
    editCategory: async (req, res) => {
        const { id } = req.params;
        const { name, imageUrl } = req.body;
        if (!id || !name || !imageUrl) {
            return res.status(400).send({ message: "Missing required fields" });
        }
        try {
            await updateCategoryService(id, name, imageUrl);
            return res.send({ message: "Category updated successfully" });
        } catch (error) {
            res.status(400).send({ message: "Error while updating category" });
        }
    },

    // Delete category
    deleteCategory: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "Category ID is required" });
        }
        try {
            await deleteCategoryService(id);
            return res.send({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(400).send({ message: "Error while deleting category" });
        }
    },

    // Add subcategory
    addSubCategory: async (req, res) => {
        const { name, imageUrl, categoryId } = req.body;
        if (!name || !imageUrl || !categoryId) {
            return res.status(400).send({ message: "Error! while creating subcategory" });
        }
        try {
            const dbRes = await createSubCategoryService(name, imageUrl, categoryId);
            return res.send({ message: "Subcategory added", id: dbRes.id, name, imageUrl, categoryId });
        } catch (error) {
            res.status(400).send({ message: "Error! while creating subcategory" });
        }
    },

    // Get all subcategories
    getAllSubCategories: async (req, res) => {
        try {
            const dbRes = await getAllSubCategoriesService();
            return res.send(dbRes);
        } catch (error) {
            res.status(500).send({ message: "Error while getting subcategories" });
        }
    },

    // Get subcategories by main category
    getSubCategoriesByMainCategory: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return res.status(400).send({ message: "Category ID is required" });
        }
        try {
            const subCategories = await getSubCategoriesService(id);
            return res.send(subCategories);
        } catch (error) {
            res.status(500).send({ message: "Error while getting subcategories" });
        }
    },

    // Edit subcategory
    editSubCategory: async (req, res) => {
        const { id } = req.params;
        const { name, imageUrl, categoryId } = req.body;
        if (!id || !name || !imageUrl || !categoryId) {
            return res.status(400).send({ message: "Missing required fields" });
        }
        try {
            await updateSubCategoryService(id, name, imageUrl, categoryId);
            return res.send({ message: "Subcategory updated successfully" });
        } catch (error) {
            res.status(400).send({ message: "Error while updating subcategory" });
        }
    },

    // Delete subcategory
    deleteSubCategory: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "Subcategory ID is required" });
        }
        try {
            await deleteSubCategoryService(id);
            return res.send({ message: "Subcategory deleted successfully" });
        } catch (error) {
            res.status(400).send({ message: "Error while deleting subcategory" });
        }
    }
};

module.exports = categoryController;
