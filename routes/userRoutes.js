const express = require("express")
const { getCategories, getCategoryByid } = require('../controllers/user/userCategory')
const { getProductDetails, getProductBySubCategory } = require('../controllers/user/product')
const { onUserSignUp, onUserLogIn, onVerfiyUser } = require('../controllers/user/authController')
const { addToCart, increaseQuantity, deceraseQuantity, getCart } = require("../controllers/user/cartController")
const { addAddress, getAddresses } = require('../controllers/user/addressController')
const { getOffers } = require('../controllers/user/userOfferController')
const { createOrder, updateOrderCompleted, updateOrderFailed, getOrders, getOrderDetailsByOrderId } = require('../controllers/user/orderController')
const { getSearchProduct } = require('../controllers/user/searchController')
const authMiddleware = require("../middlewares/user/authMiddleware")
const { createCustomer, getCustomerById, updateCustomer, deleteCustomer, loginCustomer, verifyLoginOTP, registerCustomer, sendOtp,verifyOtp } = require("../controllers/user/customersController")
// const { verifyOtp } = require("../controllers/user/shopController")
const { sendOTP } = require("../services/otpService")
const customerAuthMiddleware = require("../middlewares/user/authMiddleware")

const router = express.Router()

// category routes 
router.get('/getcategories', getCategories)
router.get('/getproductdetails', getProductDetails)
router.get('/getproductbysubid', getProductBySubCategory)
router.get('/getcategorybyid', getCategoryByid)

// login routes 
router.post('/signup', onUserSignUp)
router.post('/login', onUserLogIn)
router.post('/verifyuser', onVerfiyUser)

// cart routes 
router.post('/addtocart', authMiddleware, addToCart)
router.get('/getcart', authMiddleware, getCart)
router.post('/increasequantity', authMiddleware, increaseQuantity)
router.post('/decreasequantity', authMiddleware, deceraseQuantity)

// address Routres 
router.post('/addaddress', authMiddleware, addAddress)
router.get('/getAddresses', authMiddleware, getAddresses)

//offer routes 
router.get('/getoffers', authMiddleware, getOffers)


// order routes 
router.post('/order/createorder', authMiddleware, createOrder,)
router.put('/order/ordercompleted', authMiddleware, updateOrderCompleted)
router.post('/order/orderfailed', authMiddleware, updateOrderFailed)
router.get('/order/getorders', getOrders)
router.get('/order/getorderdetails', authMiddleware, getOrderDetailsByOrderId)

// search routes 
router.get('/search/getproducts', getSearchProduct)

//customer
// Create a new customer
// router.post("/customers",createCustomer);
// router.post("/send-otp", sendOtp);          // Step 1: Send OTP
// router.post("/verify-otp", verifyOtp);
// router.post("/customers/login",loginCustomer);
// router.post("/customers/verifylogin",verifyLoginOTP)
// router.post("/verifyotp",verifyOtp)
// router.get("/customers/:customer_id",getCustomerById);
// router.put("/customers/:customer_id",updateCustomer);
// router.delete("/customers/:customer_id", deleteCustomer);

//signup and login
router.post("/send-otp", sendOtp)
router.post("/verify-otp",verifyOtp)
router.put("/update/:customer_id",updateCustomer)

module.exports = router;


// exports 
module.exports = router