var express = require('express');
var router = express.Router();

var ProductController = require('../controller/ProductController')


router.post('/addProduct', ProductController.addProduct);
router.post('/deleteProduct', ProductController.deleteProduct);
router.post('/getProductDetail', ProductController.getProductDetail);
router.post('/updateProduct', ProductController.updateProduct);
router.post('/getAllProduct', ProductController.getAllProduct);

module.exports = router;
