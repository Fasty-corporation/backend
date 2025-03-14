const { 
    createProductService,
    getAllProductsService,
    createProductTypeService,
    findProductService,
    getAllProductTypeService,
    editProductService,  // New service for updating product
    deleteProductService   // New service for deleting product
} = require('../../services/productServices');
// Add a new product
const { upload } = require ("../../util/multer");
const productController = {
     // Assuming this is where upload is exported

    addProduct: async (req, res) => {
        try {
            // Extract form data
            const { name, mainCategoryId, subCategoryId, description } = req.body;
            const imageFiles = req.files; // This will contain uploaded images
    
            // Validation
            if (!name || !imageFiles || !mainCategoryId || !subCategoryId || !description) {
                return res.status(400).json({ message: "Missing required fields" });
            }
    
            // Extract Cloudinary URLs from uploaded files
            const imageUrls = imageFiles.map(file => file.path); // Cloudinary returns 'path' containing the URL
    
            // Store images as JSON
            const jsonImages = JSON.stringify(imageUrls);
    
            // Call service function to store product details in DB
            const dbRes = await createProductService(
                name,
                jsonImages,
                mainCategoryId,
                subCategoryId,
                description
            );
    
            return res.json({ id: dbRes.id, message: "Product added successfully" });
    
        } catch (error) {
            console.error("Error adding product:", error);
            return res.status(500).json({ message: "Error while creating product" });
        }
    },
    

    // Fetch all products
    // getAllProduct: async (req, res) => {
    //     try {
    //         const dbRes = await getAllProductsService();
    //         return res.send(dbRes);
    //     } catch (error) {
    //         res.status(500).send({ message: 'Some error occurred while fetching products' });
    //     }
    // },
    getAllProducts :  async (req, res) => {
        try {
            const products = await getAllProductsService();
    
            if (!products || products.length === 0) {
                return res.status(404).json({ message: "No products found" });
            }
    
            return res.status(200).json({ message: "Products retrieved successfully", data: products });
        } catch (error) {
            return res.status(500).json({ message: "Error while fetching products", error: error.message });
        }
    },

    // Add a product type
    addProductType: async (req, res) => {
        const { type, price, productId } = req.body;
        if (!type || !price || !productId) {
            return res.status(500).send({ message: "Error! Missing required fields." });
        }
        try {
            const dbRes = await createProductTypeService(type, price, productId);
            const findProduct = await findProductService(productId);

            const sendRes = {
                id: dbRes.id,
                // productName: findProduct.name,
                // productId: findProduct.id,
                type: type,
                price: price
            };

            return res.send(sendRes);
        } catch (error) {
            console.log(error.message)
            console.log(error)
            res.status(500).send({ message: 'Error while creating product type' });
        }
    },

    // Fetch all product types
    getAllProductTypes: async (req, res) => {
        try {
            const dbRes = await getAllProductTypeService();
            return res.send(dbRes);
        } catch (error) {
            res.status(500).send({ message: "Error while fetching product types" });
        }
    },

    // Edit a product
     editProduct : async (req, res) => {
        const { id } = req.params;
        const { name, mainCategoryId, subCategoryId, description } = req.body;
        const imageFiles = req.files; // Uploaded images
    
        if (!id || !name || !mainCategoryId || !subCategoryId || !description) {
            return res.status(400).json({ message: "Error! Missing required fields." });
        }
    
        try {
            let imageUrls = [];
    
            // If new images are uploaded, extract URLs
            if (imageFiles && imageFiles.length > 0) {
                imageUrls = imageFiles.map((file) => file.path); // Cloudinary URLs
            } else if (req.body.imageUrls) {
                // Use existing image URLs if no new images
                imageUrls = JSON.parse(req.body.imageUrls);
            }
    
            const updatedProduct = await editProductService(id, {
                name,
                imageUrls: JSON.stringify(imageUrls),
                mainCategoryId,
                subCategoryId,
                description,
            });
    
            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }
    
            return res.json({
                message: "Product updated successfully",
                updatedProduct,
            });
        } catch (error) {
            console.error("Error updating product:", error);
            return res.status(500).json({ message: "Error while updating product" });
        }
    },
    // Delete a product
    deleteProduct: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: "Product ID is required" });
        }

        try {
            const deletedProduct = await deleteProductService(id);
            if (!deletedProduct) {
                return res.status(404).send({ message: "Product not found" });
            }

            return res.send({ message: "Product deleted successfully" });
        } catch (error) {
            res.status(500).send({ message: "Error while deleting product" });
        }
    }
};

module.exports = productController;
