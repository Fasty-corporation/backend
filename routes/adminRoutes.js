const { addSubCategory, addCategory, getAllCategories, getAllSubCategories, getSubCategoriesByMainCategory, deleteCategory, editSubCategory, deleteSubCategory, editCategory } = require('../controllers/admin/categoryController')
const { addProduct, getAllProduct, addProductType, getAllProductTypes, editProduct, deleteProduct } = require('../controllers/admin/productController')
const { createOffer, getCreatedOffers, getGivenOffers, giveOffer } = require('../controllers/admin/offerController')
const { getAllUsers } = require('../controllers/admin/userController')
const { adminLogIn, verifyAdmin } = require('../controllers/admin/adminAuthController')
const express = require('express')
const adminAuthMiddleware = require('../middlewares/admin/adminAuthMiddleware')
const { createInventory, getInventoryDetails, findShopInventory, updateInventory, deleteInventory } = require('../controllers/admin/InventoryController')
const { loginShop } = require('../controllers/user/shopController')
const { createDeliveryBoy, getAllDeliveryBoys, getDeliveryBoyByMobile, loginDeliveryBoy, waitForUpdates, updateDeliveryBoyLocation, assignOrder, sendOtp, verifyOtp, updateDeliveryBoy } = require("../controllers/user/deliveryboyController");
const { create, getById, update, deletedelivery, getAll } = require('../controllers/admin/deliveriesController')
const { deleteDelivery } = require('../services/deliveriesServices')
// const { loginShop } = require("../controllers/user/shopController");
const router = express.Router()
router.post('/login', adminLogIn)
router.post('/verifyadmin', verifyAdmin)
router.post('/addcategory', adminAuthMiddleware, addCategory);
router.put("/category/:id",editCategory);
router.delete("/category/:id",deleteCategory);
router.post('/addsubcategory', adminAuthMiddleware, addSubCategory);
router.put("/subcategory/:id",editSubCategory);
router.delete("/subcategory/:id",deleteSubCategory);
router.get("/category/getsubcategoriesbycategory", getSubCategoriesByMainCategory)
router.post('/addproduct', addProduct);
router.put("/products/:id", editProduct);
router.delete("/products/:id",deleteProduct);
router.post('/addproducttype', adminAuthMiddleware, addProductType)
router.post('/offer/createoffer', createOffer)
router.post('/offer/giveoffer', adminAuthMiddleware, giveOffer)
router.get('/getallproducts', getAllProduct)
router.get('/getallcategories', getAllCategories)
router.get('/getallsubcategories', getAllSubCategories)
router.get('/getallproducttypes', getAllProductTypes)
router.get('/offer/getcreatedoffers', getCreatedOffers)
router.get('/offer/getgivenoffers', getGivenOffers)
router.get('/getusers', getAllUsers)


// Inventory
router.post('/create', createInventory);
router.get('/get', getInventoryDetails);
router.get('/shop/:shop_id', findShopInventory);
router.put('/update', updateInventory);
router.delete('/delete', deleteInventory);

//delivery
router.post("/sendOtp",sendOtp)
router.post("/verifyOtp",verifyOtp)
router.post("/delivery/create",createDeliveryBoy);
router.put("/update/:deliveryBoy_id",updateDeliveryBoy)
router.get("/delivery/all",getAllDeliveryBoys);
router.get("/delivery/:mobile_number",getDeliveryBoyByMobile);
router.post("/delivery/login",loginDeliveryBoy);
router.post("/shop/login",loginShop);
router.post("/assign/order", assignOrder);
// / **Real-time API Endpoints**
router.get("/updates",waitForUpdates);
router.post("/update-location", updateDeliveryBoyLocation);

// deliver
  router.post('/deliver/create',create);
  router.get('/', getAll);
  router.get('/:id', getById);
  router.put('/:id', update);
  router.delete('/:id', deletedelivery);


// exporting the router object
module.exports = router