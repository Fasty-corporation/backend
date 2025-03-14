const Razorpay = require('razorpay')
const { getCartProducts, deleteCartService } = require('../../services/cartServices')
const { findOfferbyId, deleteGivenOfferService } = require('../../services/offerServices')
const { addTransactionService, createOrderService, createOrderItemService, updateTransactionService, getUserOrdersService, getOrderDetailsService } = require('../../services/orderServices')
const sequelize = require('../../util/database');
// const Razorpay = require("razorpay");
// const { sequelize } = require("../../config/database");
// const { Order, OrderItem, Cart, Shop, Product, Transaction } = require("../../models");
const Order = require("../../models/order");
const OrderItem = require("../../models/orderItem")
const Cart = require("../../models/cart");
const Shop = require("../../models/shops");
const {Product} = require("../../models/products.js");
const Transaction = require("../../models/transaction.js")
const Customer = require("../../models/customersModel.js")
const mongoose = require("mongoose");
const Inventory = require("../../models/inventory.js");

const orderController = {
    
    // const Razorpay = require("razorpay");
     createOrder :  async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            const { email, id: userId } = req.user || {};
            const { payment_method, customer_location } = req.body || {};
    
            // 🛑 Basic validation
            if (!userId || !email) {
                return res.status(400).json({ message: "User authentication details missing" });
            }
            if (!customer_location) {
                return res.status(400).json({ message: "Customer location is required" });
            }
    
            // ✅ Fetch cart items
            const cartProducts = await Cart.find({ userId })
            .populate({
                path: "productId",
                select: "name price imageUrl"  // Only get these fields
            })
            .session(session);
        
            
            console.log("Cart Products:", cartProducts);
                        console.log("Cart Data:", cartProducts);
    
            if (!cartProducts.length) {
                return res.status(400).json({ message: "Cart is empty" });
            }
    
            let unavailableProducts = [];
            let orders = [];
    
            for (const cartItem of cartProducts) {
                const product = cartItem.productId;
    
                if (!product || !product._id) {
                    unavailableProducts.push(`Product ID ${cartItem.productId} is no longer available.`);
                    continue;
                }
    
                // ✅ Check inventory stock
                const availableInventory = await Inventory.findOne({
                    product_id: product._id,
                    stock: { $gte: cartItem.quantity }
                }).session(session);
    
                if (!availableInventory) {
                    unavailableProducts.push(`Product ${product.name} is out of stock.`);
                    continue;
                }
    
                const totalPrice = cartItem.quantity * availableInventory.price + 5; // Including delivery charge
    
                const orderData = {
                    totalPrice,
                    paidAmount: payment_method === "COD" ? 0 : totalPrice,
                    dueAmount: payment_method === "COD" ? totalPrice : 0,
                    location: customer_location,
                    userId,
                    shopId: availableInventory.shop_id,
                    status: "Pending"
                };
    
                // ✅ Razorpay Payment Handling (if payment method is not COD)
                if (payment_method !== "COD") {
                    try {
                        const rzp = new Razorpay({
                            key_id: process.env.RZP_KEY_ID,
                            key_secret: process.env.RZP_KEY_SECRET
                        });
    
                        const razorpayOrder = await rzp.orders.create({
                            amount: totalPrice * 100,
                            currency: "INR"
                        });
    
                        await Transaction.create([
                            {
                                transactionId: razorpayOrder.id,
                                amount: totalPrice,
                                email
                            }
                        ], { session });
    
                        orderData.paymentId = razorpayOrder.id;
    
                    } catch (error) {
                        console.error("❌ Razorpay Payment Failed:", error);
                        throw new Error("Payment processing failed");
                    }
                }
    
                // ✅ Create Order
                const createdOrder = await Order.create([orderData], { session });
    
                if (!createdOrder.length) {
                    throw new Error("Order creation failed");
                }
    
                // ✅ Insert Order Item
                await OrderItem.create([
                    {
                        orderDetails: JSON.stringify(product),
                        userId,
                        orderId: createdOrder[0]._id,
                        quantity: cartItem.quantity
                    }
                ], { session });
    
                // ✅ Update Inventory Stock
                await Inventory.updateOne(
                    { _id: availableInventory._id },
                    { $inc: { stock: -cartItem.quantity } },
                    { session }
                );
    
                orders.push(createdOrder[0]);
            }
    
            if (orders.length === 0) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    message: "Some items in your cart are no longer available",
                    unavailableProducts
                });
            }
    
            // ✅ Clear Cart after order placement
            await Cart.deleteMany({ userId }).session(session);
    
            // ✅ Commit Transaction
            await session.commitTransaction();
            session.endSession();
    
            return res.status(201).json({
                message: "Orders placed successfully",
                orders
            });
    
        } catch (error) {
            console.error("❌ Order Creation Error:", error.message);
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        }
    },
    
        // module.exports = { createOrder };
    
    // createOrder : async (req, res) => {
    //     const { email, id } = req.user;
    //     const { payment_method, customer_location } = req.body;
    //     console.log("Request Body:", req.body);
    //     console.log("User Data:", req.user);
    //     try {
    //         if (!email || !id || !customer_location) {
    //             return res.status(400).json({ message: "Error: Missing customer details" });
    //         }
    
    //         // Fetch cart products
    //         const cartProducts = await Cart.findAll({ where: { userId: id }, include: [{ model: Product }] });
    
    //         if (!cartProducts.length) {
    //             return res.status(400).json({ message: "Cart is empty" });
    //         }
    
    //         // Fetch nearby shops (within 3km radius)
    //         const nearbyShops = await Shop.findAll(); // Implement logic to filter by location
    
    //         if (!nearbyShops.length) {
    //             return res.status(400).json({ message: "No nearby shops available" });
    //         }
    //         console.log("Request Body:", req.body);
    //         console.log("User Data:", req.user);
    //         // Split orders based on shop availability
    //         const shopWiseOrders = {};
    //         for (const cartItem of cartProducts) {
    //             const product = cartItem.Product;
    //             const availableShop = nearbyShops.find(shop => product.stock >= cartItem.quantity);
                
    //             if (availableShop) {
    //                 if (!shopWiseOrders[availableShop.id]) shopWiseOrders[availableShop.id] = [];
    //                 shopWiseOrders[availableShop.id].push({ product, quantity: cartItem.quantity });
    //             } else {
    //                 return res.status(400).json({ message: `Product ${product.name} is out of stock` });
    //             }
    //         }
    
    //         const orders = [];
    //         const transaction = await sequelize.transaction();
    
    //         for (const [shopId, products] of Object.entries(shopWiseOrders)) {
    //             let totalPrice = products.reduce((total, item) => total + (item.quantity * item.product.price), 0);
    //             totalPrice += 5; // Delivery charge
    
    //             let orderData = {
    //                 totalPrice,
    //                 paidAmount: payment_method === "COD" ? 0 : totalPrice,
    //                 dueAmount: payment_method === "COD" ? totalPrice : 0,
    //                 location: customer_location,
    //                 userId: id,
    //                 shopId,
    //                 status: "Pending",
    //             };
    
    //             if (payment_method !== "COD") {
    //                 // Online payment via Razorpay
    //                 const rzp = new Razorpay({ key_id: process.env.RZP_KEY_ID, key_secret: process.env.RZP_KEY_SECRET });
    //                 const razorpayOrder = await rzp.orders.create({ amount: totalPrice * 100, currency: "INR" });
    
    //                 await Transaction.create({
    //                     transactionId: razorpayOrder.id,
    //                     amount: totalPrice,
    //                     email,
    //                 }, { transaction });
    
    //                 orderData.paymentId = razorpayOrder.id;
    //             }
    
    //             const createdOrder = await Order.create(orderData, { transaction });
    
    //             await OrderItem.bulkCreate(
    //                 products.map(({ product, quantity }) => ({
    //                     orderDetails: JSON.stringify(product),
    //                     userId: id,
    //                     orderId: createdOrder.id,
    //                     quantity,
    //                 })),
    //                 { transaction }
    //             );
    
    //             orders.push(createdOrder);
    //         }
    
    //         await transaction.commit();
    //         res.json({ message: "Orders placed successfully", orders });
    
    //     } catch (error) {
    //         console.error("Order Creation Error:", error);
    //         res.status(500).json({ message: "Internal server error", error: error.message });
    //     }
    // },
    
    // module.exports = { createOrder };
    
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