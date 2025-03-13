const { 
    createCategoryService, 
    getAllCategoriesService, 
    createSubCategoryService, 
    getAllSubCategoriesService,
    getCategoryById, 
    updateCategoryService, 
    deleteCategoryService, 
    updateSubCategoryService, 
    deleteSubCategoryService 
} = require('../../services/categoryServices')
const { getSubCategoriesService } = require('../../services/userCategoryServices')

const categoryController = {
    // Add main category
     addCategory:async (req, res) => {
        const { name } = req.body;
        const imageFile = req.file; // Uploaded image
    
        if (!name || !imageFile) {
            return res.status(400).json({ message: "Error while creating category" });
        }
    
        try {
            const imageUrl = imageFile.path; // Cloudinary URL
    
            const category = await createCategoryService(name, imageUrl);
    
            return res.status(201).json({
                message: "Category added successfully",
                id: category.id,
                name: category.name,
                imageUrl: category.imageUrl,
            });
        } catch (error) {
            console.error("Error creating category:", error);
            return res.status(500).json({ message: "Error! while creating category" });
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
     editCategory : async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const imageFile = req.file; // Uploaded image
    
        if (!id || !name) {
            return res.status(400).json({ message: "Missing required fields" });
        }
    
        try {
            // Fetch existing category
            const existingCategory = await getCategoryById(id);
            if (!existingCategory) {
                return res.status(404).json({ message: "Category not found" });
            }
    
            // Use new image URL if uploaded, else keep old one
            const imageUrl = imageFile ? imageFile.path : existingCategory.imageUrl;
    
            await updateCategoryService(id, name, imageUrl);
    
            return res.json({ message: "Category updated successfully" });
        } catch (error) {
            console.error("Error updating category:", error);
            return res.status(500).json({ message: "Error while updating category" });
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
     addSubCategory :  async (req, res) => {
        try {
            const { name, categoryId } = req.body;
            if (!name || !categoryId || !req.file) {
                return res.status(400).send({ message: "Missing required fields" });
            }
    
            const imageUrl = req.file.path; // Image URL from Multer (Local) or Cloudinary
    
            const dbRes = await createSubCategoryService(name, imageUrl, categoryId);
            return res.send({ message: "Subcategory added", id: dbRes.id, name, imageUrl, categoryId });
    
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error! while creating subcategory" });
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
    
 editSubCategory : async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categoryId } = req.body;

        if (!id || !name || !categoryId) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        // Handle image update (if provided)
        const imageUrl = req.file ? req.file.path : req.body.imageUrl;

        const updatedSubCategory = await updateSubCategoryService(id, name, imageUrl, categoryId);

        if (!updatedSubCategory) {
            return res.status(404).send({ message: "Subcategory not found" });
        }

        return res.send({
            message: "Subcategory updated successfully",
            updatedSubCategory,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error while updating subcategory" });
    }
}
,
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
