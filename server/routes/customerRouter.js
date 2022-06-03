const express = require("express")
const customerController = require("../controllers/customerController");
const customerRouter = express.Router()

// Get contact list
customerRouter.get('', customerController.getAllCustomer);

// Get one customer detail
customerRouter.get('/:customerId', customerController.getOneCustomer);

// Add new customer
customerRouter.post('', customerController.addCustomer);

// Edit customer details
customerRouter.put('/:customerId', customerController.updateCustomer);

// Delete customer
customerRouter.delete('/:customerId', customerController.deleteCustomer);

// Delete list of customers
customerRouter.put('', customerController.deleteListCustomer)

module.exports = customerRouter;