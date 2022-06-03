const express = require("express")
require('jsonwebtoken');
const passport = require('passport');
const productController = require("../controllers/productController")
const productRouter = express.Router()

// get all available product
productRouter.get('/available', productController.getAvailableProduct)

// get particular product
productRouter.get('/:tag', productController.getOneProduct)

// add product
productRouter.post('', productController.addProduct)

// update product
productRouter.put('/:tag', productController.updateProduct)

// delete product
productRouter.delete('/:tag', productController.deleteProduct)

// get all product
productRouter.get('', productController.getAllProduct)


module.exports = productRouter;