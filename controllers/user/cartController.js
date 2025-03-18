const { findCartService, createCartService, getCartProducts } = require("../../services/cartServices")
const { getProductPriceService } = require("../../services/productServices")
const cartController = {

    // add to cart
    addToCart: async (req, res) => {
        const { id: userId } = req.user; // Extract user ID from token
        const { quantity, productTypeId, productId } = req.body;
    
        // 🛑 Check for missing fields
        if (!userId || !quantity || !productTypeId || !productId) {
            return res.status(400).json({ message: "All fields are required!" });
        }
    
        try {
            // ✅ Step 1: Add Product to Cart
            const cartItem = await createCartService(quantity, productTypeId, productId, userId);
            
            if (!cartItem) {
                return res.status(500).json({ message: "Failed to add item to cart" });
            }
    
            // ✅ Step 2: Get Product Price
            const productData = await getProductPriceService(productTypeId);
    
            if (!productData || !productData.price) {
                return res.status(500).json({ message: "Failed to fetch product price" });
            }
    
            // ✅ Step 3: Return Updated Cart Data
            const cartResponse = {
                cartId: cartItem.id,
                productId,
                productTypeId,
                price: productData.price,
                quantity
            };
    
            return res.status(201).json({ message: "Item added to cart successfully", cart: cartResponse });
    
        } catch (error) {
            console.error("❌ Add to Cart Error:", error.message);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },
    
    // increase qunatity on specific product
    increaseQuantity: async (req, res) => {
        const { quantity, productTypeId } = req.body
        const { id } = req.user

        if (!quantity || !productTypeId || !id) {
            return res.status(400).send({ message: "Error while adding quantity!" })
        }
        try {
            const dbRes = await findCartService(id, productTypeId)
            await dbRes.update({ quantity: quantity })
            const cart = {
                id: dbRes.id,
                productTypeId,
                quantity: quantity
            }
            return res.send(cart)

        } catch (error) {
            return res.status(400).send({ message: "Error while adding quantity!" })
        }
    },

    // decrease quantity on specific product
    deceraseQuantity: async (req, res) => {
        const { quantity, productTypeId } = req.body
        const { id } = req.user

        if (!productTypeId || !id) {
            return res.status(400).send({ message: "Error while decreasing quantity!" })
        }

        try {
            const dbRes = await findCartService(id, productTypeId)
            if (quantity >= 1) {
                await dbRes.update({ quantity: quantity })
                const cart = {
                    id: dbRes.id,
                    productTypeId,
                    quantity: quantity
                }
                return res.send(cart)
            }
            else {
                await dbRes.destroy()
                return res.send({ quantity: 0 })
            }

        } catch (error) {
            res.status(400).send({ message: "Error!" })
        }
    },

    // getting all cart products from db
     getCart : async (req, res) => {
        const { id: userId } = req.user;
    
        // 🛑 If userId is not found
        if (!userId) {
            return res.status(400).send({ message: "User not found while getting the cart!" });
        }
    
        try {
            const cartItems = await getCartProducts(userId);
    
            if (!cartItems.length) {
                return res.status(200).send({ message: "Cart is empty", cartItems: [] });
            }
    
            return res.status(200).json(cartItems);
    
        } catch (error) {
            console.error("❌ Error in getCart:", error.message);
            res.status(500).send({ message: "Failed to get the cart!" });
        }
    }
}

module.exports = cartController
