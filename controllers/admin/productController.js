const { 
    createProductService,
    getAllProductsService,
    createProductTypeService,
    findProductService,
    getAllProductTypeService,
    editProductService,  // New service for updating product
    deleteProductService   // New service for deleting product
} = require('../../services/productServices');

const productController = {
    // Add a new product
    addProduct: async (req, res) => {
        const { name, imageUrls, mainCategoryId, subCategoryId, description } = req.body;
        if (!name || !imageUrls || !mainCategoryId || !subCategoryId || !description) {
            return res.status(500).send({ message: "Error! Missing required fields." });
        }
        try {
            const jsonImages = JSON.stringify(imageUrls);
            const dbRes = await createProductService(
                name,
                jsonImages,
                mainCategoryId,
                subCategoryId,
                description
            );

            return res.send({ id: dbRes.id, message: "Product added successfully" });

        } catch (error) {
            res.status(500).send({ message: "Error! while creating product" });
        }
    },

    // Fetch all products
    getAllProduct: async (req, res) => {
        try {
            const dbRes = await getAllProductsService();
            return res.send(dbRes);
        } catch (error) {
            res.status(500).send({ message: 'Some error occurred while fetching products' });
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
                productName: findProduct.name,
                productId: findProduct.id,
                type: type,
                price: price
            };

            return res.send(sendRes);
        } catch (error) {
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
    editProduct: async (req, res) => {
        const { id } = req.params;
        const { name, imageUrls, mainCategoryId, subCategoryId, description } = req.body;

        if (!id || !name || !imageUrls || !mainCategoryId || !subCategoryId || !description) {
            return res.status(400).send({ message: "Error! Missing required fields." });
        }

        try {
            const updatedProduct = await editProductService(id, {
                name,
                imageUrls: JSON.stringify(imageUrls),
                mainCategoryId,
                subCategoryId,
                description
            });

            if (!updatedProduct) {
                return res.status(404).send({ message: "Product not found" });
            }

            return res.send({ message: "Product updated successfully", updatedProduct });
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Error while updating product" });
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
