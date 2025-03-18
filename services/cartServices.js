const Cart = require("../models/cart");
const ProductType = require("../models/productType");
const Products = require("../models/products");

const cartServices = {
    createCartService: async (quantity, productTypeId, productId, userId) => {
        try {
            // ✅ Check if the product already exists in the cart
            const existingCartItem = await Cart.findOne({ productId, productTypeId, userId });
    
            if (existingCartItem) {
                // ✅ If product already exists, update the quantity
                const updatedCartItem = await Cart.findOneAndUpdate(
                    { productId, productTypeId, userId },
                    { $inc: { quantity: quantity } }, // Increment the quantity
                    { new: true }
                );
                return updatedCartItem;
            } else {
                // ✅ If product doesn't exist, create a new cart item
                const newCartItem = await Cart.create({
                    quantity,
                    productTypeId,
                    productId,
                    userId
                });
                return newCartItem;
            }
    
        } catch (error) {
            console.error("❌ Error in createCartService:", error.message);
            throw new Error("Failed to add item to cart");
        }
    },
    

     getCartProducts: async (userId) => {
        try {
            if (!userId) {
                throw new Error("User not found");
            }
    
            const cartItems = await Cart.find({ userId })
                .populate({
                    path: "productTypeId",
                    select: "id type price",
                    populate: {
                        path: "productId",
                        select: "id name imageUrls"
                    }
                });
    
            // ✅ If cart is empty
            if (!cartItems.length) {
                return { message: "Cart is empty", cartItems: [] };
            }
    
            // ✅ Formatted Response
            const formattedCart = cartItems.map((item) => ({
                cartId: item._id,
                quantity: item.quantity,
                productTypeId: item.productTypeId._id,
                productType: item.productTypeId.type,
                price: item.productTypeId.price,
                productId: item.productTypeId.productId._id,
                productName: item.productTypeId.productId.name,
                productImage: item.productTypeId.productId.imageUrls,
            }));
    
            return formattedCart;
    
        } catch (error) {
            console.error("❌ Error in getCartProducts:", error.message);
            throw new Error("Failed to fetch cart products");
        }
    },
    
    deleteCartService: async (userId, transaction) => {
        try {
            const options = { where: { userId } };
            if (transaction) {
                options.transaction = transaction;
            }

            const dbRes = await Cart.destroy(options);
            return dbRes;
        } catch (error) {
            throw error;
        }
    },
    findCartService: async (userId, productTypeId) => {
        try {
            const dbRes = Cart.findOne({ where: { userId, productTypeId } })
            return dbRes
        } catch (error) {
            throw error
        }
    }





}


module.exports = cartServices