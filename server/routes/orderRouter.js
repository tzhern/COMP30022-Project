const express = require("express")
require('jsonwebtoken');
const orderController = require("../controllers/orderController")
const orderRouter = express.Router()

// get all order
orderRouter.get('', orderController.getAllOrder)

// get order by customer
orderRouter.get('/customer/:emailAddress', orderController.getCustomerOrder)

// get order by product
orderRouter.get('/product/:productTag', orderController.getGrapeOrder)

// add order
orderRouter.post('/:emailAddress', orderController.addOrder)

// update order status
orderRouter.put('/status/:orderId', orderController.updateOrderStatus)

// update order details
orderRouter.put('/update/:orderId', orderController.updateOrderDetails)

// delete list of orders
orderRouter.put('', orderController.deleteListOrder)

// delete one order
orderRouter.delete('/:orderId', orderController.deleteOrder)

module.exports = orderRouter;
