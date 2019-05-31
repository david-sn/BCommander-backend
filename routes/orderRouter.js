var express = require('express');
var router = express.Router();

var OrderController = require('../controller/OrderController')


router.post('/createOrder',OrderController.createOrder);
router.post('/updateOrder',OrderController.updateOrder);
router.post('/cancelOrder',OrderController.cancelOrder);
router.post('/shippingOrder',OrderController.shippingOrder);
router.post('/getAllOrder',OrderController.getAllOrder);
router.post('/getOrderDetails',OrderController.getOrderDetails);

module.exports = router;
