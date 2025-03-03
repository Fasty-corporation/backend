const Razorpay = require('razorpay')
const { getCartProducts, deleteCartService } = require('../../services/cartServices')
const { findOfferbyId, deleteGivenOfferService } = require('../../services/offerServices')
const { addTransactionService, createOrderService, createOrderItemService, updateTransactionService, getUserOrdersService, getOrderDetailsService } = require('../../services/orderServices')
const sequelize = require('../../util/database')

const orderController = {

    createOrder: async (req, res) => {
        const { email, id } = req.user
        const { offerId } = req.body
        try {
            if (!email || !id) {
                throw new Error("error while creating order user not found")
            }
            // taking all cart products
            const cartProducts = await getCartProducts(id)

            // calculating total price 
            let totalPrice = cartProducts.reduce((prev, curr) => {
                const productTotal = curr.quantity * curr.price;
                return prev + productTotal;
            }, 0)
            
            if (offerId) {
                const appliedOffer = await findOfferbyId(offerId)
                if (appliedOffer) { totalPrice = totalPrice - Math.floor((totalPrice * (appliedOffer.discount / 100))) }
            }
            // including 5
            totalPrice = totalPrice + 5

            // razorpay instance
            const amount = totalPrice * 100
            const rzp = new Razorpay({
                key_id: process.env.RZP_KEY_ID,
                key_secret: process.env.RZP_KEY_SECRET
            })
            // creating the order
            rzp.orders.create({ amount: amount, currency: 'INR' }, async (err, order) => {
                try {
                    if (err) {
                        throw new Error(JSON.stringify(err))
                    }
                    await addTransactionService(order.id, totalPrice, email)
                    res.send({ order, key_id: process.env.RZP_KEY_ID })

                } catch (error) {
                    res.status(400).send({ message: "error while creating order" })

                }

            })

        } catch (error) {
            console.log(error)
            console.log(error.message)
            res.status(500).send({ message: "internal server error", error })
        }
    },
    updateOrderCompleted: async (req, res) => {
        const { id } = req.user
        const { orderId, paymentId, address, offerId } = req.body

        if (!id || !orderId || !paymentId || !address) {
            throw new Error("error while creating order")
        }
        // transaction variable
        let tran;
        try {
            // creating transaction object
            tran = await sequelize.transaction()

            // taking all cart products
            const cartProducts = await getCartProducts(id)

            // calculating total price 
            let totalAmount = cartProducts.reduce((prev, curr) => {
                const productTotal = curr.quantity * curr.price;
                return prev + productTotal + 5;
            }, 0)

            // if user applied some offer
            let discountPercentage = 0
            let finalAmount = totalAmount
            if (offerId) {
                const appliedOffer = await findOfferbyId(offerId)

                if (appliedOffer) {
                    finalAmount = Math.round(finalAmount - (finalAmount * (appliedOffer.discount / 100)))
                    discountPercentage = appliedOffer.discount
                }
            }
            // creating the order in order table
            const createdOrder = await createOrderService
                (totalAmount, discountPercentage, finalAmount, address, id, tran, orderId)

            // creating the order item table in bulk
            const orderItems = cartProducts.map((value) => {
                return {
                    orderDetails: JSON.stringify({ ...value }),
                    userId: id,
                    orderId: createdOrder.id
                }
            })
            await createOrderItemService(orderItems, tran)

            // deleting the cart items 
            await deleteCartService(id, tran)

            // updating the transaction table
            await updateTransactionService(orderId, "Completed", paymentId, tran)

            // deleting the offers if user applied 
            if (offerId) {
                await deleteGivenOfferService(offerId, tran)
            }


            // if all promises fulfiled
            await tran.commit()

            res.send({ message: "Order completed" })
        } catch (error) {

            await tran.rollback()
            res.status(400).send({ message: "error while creating order" })
        }
    },

    // for updating the order status failed 
    updateOrderFailed: async (req, res) => {
        const { orderId } = req.body
        try {
            if (!orderId) {
                res.status(500).send({ message: "Order Id is not found " })
            }
            updateTransactionService(orderId, "Failed")
            res.send({ message: "Order failed " })
        } catch (error) {
            res.status(500).send({ message: "Error while updating order status failed" })
        }
    },
    getOrders: async (req, res) => {
        const { id, email } = req.user
        // if id && email is undefined 
        if (!id || !email) {
            res.status(500).send({ message: "user not found" })
        }
        try {
            const orders = await getUserOrdersService(id, email)
            res.send(orders)
        } catch (error) {
            res.status(500).send({ message: "Error while getting orders" })
        }
    },

    getOrderDetailsByOrderId: async (req, res) => {
        const { orderid } = req.query
        if (!orderid) {
            res.status(500).send({ message: "order not found" })
        }
        try {
            const orderDetails = await getOrderDetailsService(orderid)
            res.send(orderDetails)
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Error while getting order details" })
        }
    }
}

module.exports = orderController