const MainCategories = require("../models/mainCategories");
const ProductType = require("../models/productType");
const Product = require("../models/products");
const SubCategories = require("../models/subCategories");

const userCategoryServices = {

    // Get all categories with their products and product types
    getCategoryWithProductsService: async () => {
        try {
            const dbRes = await MainCategories.findAll({
                include: [{ model: Product, include: [{ model: ProductType }] }]
            });
            
            // Parsing the image URLs in product array
            const categories = dbRes.map((category) => {
                category.products.forEach(product => {
                    product.imageUrls = JSON.parse(product.imageUrls);
                });
                return category;
            });

            return categories;
        } catch (error) {
            throw error;
        }
    },

    // Get all subcategories related to a main category
    getSubCategoriesService: async (mainCategoryId) => {
        try {
            const dbRes = await SubCategories.findAll({
                where: { mainCategoryId }
            });
            return dbRes;
        } catch (error) {
            throw error;
        }
    },
     getCategoryById : async (id) => {
        return await MainCategories.findById(id);
    },
    
    // Create a new main category
    createCategoryService: async (name, imageUrl) => {
        try {
            const newCategory = await MainCategories.create({ name, imageUrl });
            return newCategory;
        } catch (error) {
            throw error;
        }
    },

    // Update an existing main category
     updateCategoryService : async (id, name, imageUrl) => {
        try {
            const updatedCategory = await MainCategories.findByIdAndUpdate(
                id, // Find by category ID
                { name, imageUrl }, // Update fields
                { new: true, runValidators: true } // Return updated document
            );
            
            return updatedCategory;
        } catch (error) {
            throw error;
        }
    },
    

    // Delete a main category
    deleteCategoryService: async (id) => {
        try {
            await MainCategories.destroy({ where: { id } });
            return { message: "Category deleted successfully" };
        } catch (error) {
            throw error;
        }
    },

    // Create a new subcategory
    createSubCategoryService: async (name, imageUrl, mainCategoryId) => {
        try {
            const newSubCategory = await SubCategories.create({ name, imageUrl, mainCategoryId });
            return newSubCategory;
        } catch (error) {
            throw error;
        }
    },

    // Update an existing subcategory
     updateSubCategoryService: async (id, name, imageUrl, categoryId) => {
        try {
            const updatedSubCategory = await SubCategories.findByIdAndUpdate(
                id,
                { name, imageUrl, categoryId },
                { new: true } // Return updated document
            );
            return updatedSubCategory;
        } catch (error) {
            throw error;
        }
    },

    // Delete a subcategory
    deleteSubCategoryService: async (id) => {
        try {
            await SubCategories.destroy({ where: { id } });
            return { message: "Subcategory deleted successfully" };
        } catch (error) {
            throw error;
        }
    }
};

module.exports = userCategoryServices;
