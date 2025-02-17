const { addSubCategory, addCategory, getAllCategories, getAllSubCategories, getSubCategoriesByMainCategory } = require('../controllers/admin/categoryController')
const { addProduct, getAllProduct, addProductType, getAllProductTypes } = require('../controllers/admin/productController')
const { createOffer, getCreatedOffers, getGivenOffers, giveOffer } = require('../controllers/admin/offerController')
const { getAllUsers } = require('../controllers/admin/userController')
const { adminLogIn, verifyAdmin } = require('../controllers/admin/adminAuthController')
const express = require('express')
const adminAuthMiddleware = require('../middlewares/admin/adminAuthMiddleware')

const router = express.Router()
router.post('/login', adminLogIn)
router.post('/verifyadmin', verifyAdmin)
router.post('/addcategory', adminAuthMiddleware, addCategory)
router.post('/addsubcategory', adminAuthMiddleware, addSubCategory)
router.get("/category/getsubcategoriesbycategory", getSubCategoriesByMainCategory)
router.post('/addproduct', adminAuthMiddleware, addProduct)
router.post('/addproducttype', adminAuthMiddleware, addProductType)
router.post('/offer/createoffer', adminAuthMiddleware, createOffer)
router.post('/offer/giveoffer', adminAuthMiddleware, giveOffer)
router.get('/getallproducts', getAllProduct)
router.get('/getallcategories', getAllCategories)
router.get('/getallsubcategories', getAllSubCategories)
router.get('/getallproducttypes', getAllProductTypes)
router.get('/offer/getcreatedoffers', getCreatedOffers)
router.get('/offer/getgivenoffers', getGivenOffers)
router.get('/getusers', getAllUsers)



// exporting the router object
module.exports = router