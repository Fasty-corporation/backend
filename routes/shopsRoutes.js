const express = require('express');
const { createShop,getAllShops,getShopById,updateShop,deleteShop } = require('../controllers/user/shopController');
const router = express.Router();

router.post('/create', createShop);
router.get('/all', getAllShops);
router.get('/:shopId', getShopById);
router.put('/:shopId', updateShop);
router.delete('/:shopId',deleteShop);

module.exports = router;
