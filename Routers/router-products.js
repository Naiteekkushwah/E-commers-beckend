const express = require('express');
const router = express.Router();
const auth = require('../middelsware/user-founde');
const productController = require('../Controller/product.controller');

router.get('/products', productController.getAllProducts);
router.get('/discount', auth.userfounde, productController.getDiscountProducts);
router.get('/new-collection', auth.userfounde, productController.getNewCollectionProducts);
router.get('/stock', auth.userfounde, productController.getStockProducts);
router.post('/ADDtocart', auth.userfounde, productController.addToCart);
router.get('/add-product', auth.userfounde, productController.addProduct);
router.post('/likeproduct',auth.userfounde,productController.likeproductfind)
router.get('/likeproductfind',auth.userfounde,productController.likeproductfindget)
router.post("/order", auth.userfounde,productController.createOrder);
router.get("/orderfind", auth.userfounde,productController.getUserOrders);

module.exports = router;