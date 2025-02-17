const { findCartService, createCartService, getCartProducts } = require("../../services/cartServices")
const { getProductPriceService } = require("../../services/productServices")
const cartController = {

    // add to cart
    addToCart: async (req, res) => {
        const { id } = req.user
        const { quantity, productTypeId } = req.body

        // if some fields are null 
        if (!id || !quantity || !productTypeId) {
            return res.status(500).send({ messsage: "error while adding to cart" })
        }
        try {
            const dbRes = await createCartService(quantity, productTypeId, id)
            const { price } = await getProductPriceService(productTypeId)
            if (!price) { return res.status(500).send({ message: "Error while adding to cart !" }) }
            const cart = {
                id: dbRes.id,
                productTypeId,
                productType: { price: price },
                quantity: quantity
            }

            return res.send(cart)

        } catch (error) {
            res.status(500).send({ message: "Error while adding to cart !" })
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
    getCart: async (req, res) => {
        const { id } = req.user
        if (!id) {
            return res.status.send({ message: "error while getting the cart" })
        }
        try {
            const dbRes = await getCartProducts(id)
            return res.send(dbRes);
        } catch (error) {
            res.status(400).send({ message: "error while getting the cart" })
        }
    }

}

module.exports = cartController
