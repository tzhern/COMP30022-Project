const Customer = require('../models/customer')
const Order = require('../models/order')
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId;

// Get all customer
const getAllCustomer = async (req, res) => {
    let userId = new ObjectId(req.user._id);
    try {
        const customers = await Customer.find({ userId: userId }).lean()
        console.log("get all customer")
        return res.status(200).json(customers);
    } catch (err) {
        console.log("failed to get customer from the database!")
        return res.status(500).json({ msg: err });
    }
}

// Get one customer details
const getOneCustomer = async (req, res) => {
    let userId = new ObjectId(req.user._id);
    let customerId = req.params.customerId;
    try {
        // find the product
        const customer = await Customer.find({ userId: userId, _id: customerId }, '-_id').lean()
        // if customer does not exist
        if (customer.length == 0) {
            console.log("Customer does not exist!")
            return res.status(400).json({ msg: 'Customer does not exist!' })
        }
        console.log("get customer infomation")
        return res.send(customer)
    } catch (err) {
        console.log("Database query 'menu' failed!")
        return res.status(500).json({ msg: err })
    }
}


// Add new customer
const addCustomer = async (req, res) => {
    let userId = new ObjectId(req.user._id);
    const newCustomer = new Customer({
        userId: userId,
        tag: req.body.tag,
        description: req.body.description,
        givenName: req.body.givenName,
        familyName: req.body.familyName,
        emailAddress: req.body.emailAddress,
        phoneNumber: req.body.phoneNumber,
        companyName: req.body.companyName,
        address: req.body.address,
        abn: req.body.abn,
        notes: req.body.notes
    })

    await newCustomer.save((err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ msg: err })
        }
        return res.status(200).json(newCustomer)
    })
}

// Update customer details
const updateCustomer = async (req, res) => {
    let userId = new ObjectId(req.user._id);
    let customerId = req.params.customerId
    userId = new ObjectId(userId);
    try {
        let description = req.body.description;
        let givenName = req.body.givenName;
        let familyName = req.body.familyName;
        let emailAddress = req.body.emailAddress;
        let phoneNumber = req.body.phoneNumber;
        let companyName = req.body.companyName;
        let address = req.body.address;
        let abn = req.body.abn;
        let notes = req.body.notes;

        // update field that changed
        if (description) {
            await Customer.updateOne({ userId: userId, _id: customerId }, { $set: { description: description } })
        }
        if (givenName) {
            await Customer.updateOne({ userId: userId, _id: customerId }, { $set: { givenName: givenName } })
        }
        if (familyName) {
            await Customer.updateOne({ userId: userId, _id: customerId }, { $set: { familyName: familyName } })
        }
        if (emailAddress) {
            await Customer.updateOne({ userId: userId, _id: customerId }, { $set: { emailAddress: emailAddress } })
            customerEmail = emailAddress;
        }
        if (phoneNumber) {
            await Customer.updateOne({ userId: userId, _id: customerId }, { $set: { phoneNumber: phoneNumber } })
        }
        if (companyName) {
            await Customer.updateOne({ userId: userId, _id: customerId }, { $set: { companyName: companyName } })
        }
        if (address) {
            await Customer.updateOne({ userId: userId, _id: customerId }, { $set: { address: address } })
        }
        if (abn) {
            await Customer.updateOne({ userId: userId, _id: customerId }, { $set: { abn: abn } })
        }
        if (notes) {
            await Customer.updateOne({ userId: userId, _id: customerId }, { $set: { notes: notes } })
        }

        let customer = await Customer.findOne({ userId: userId, _id: customerId });
        if (customer) {
            console.log("Update product successfully")
            return res.status(200).json(customer);
        } else {
            console.log("could not find customer")
            return res.status(500).json({ msg: 'could not find customer' })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: err })
    }
}

// delete product
const deleteCustomer = async (req, res) => {
    let userId = new ObjectId(req.user._id);
    let customerId = req.params.customerId;
    await Customer.findOneAndDelete({ userId: userId, _id: customerId })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json({ msg: err }));
}

// delete list of order
const deleteListCustomer = async(req, res) => {
    let userId = new ObjectId(req.user._id);
    let customerIds = req.body.customerids
    try {
        // delete selected orders
        for (let i = 0; i < customerIds.length; i++) {
            let customerDetail = await Customer.findOne({userId: userId, _id: customerIds[i]}, {_id: true})
            let customerId = new ObjectId(customerDetail._id);
            // delete order under the customer
            const orders = await Order.find({userId: userId, customerId: customerId}, {userId: false})
            for (let i = 0; i < orders.length; i++) {
                console.log(orders[i])
                await Order.findOneAndDelete({_id: orders[i]})
            }
            //delete customer
            await Customer.findOneAndDelete({userId: userId, _id: customerIds[i]})
        }
        const currentCustomer = await Customer.find({userId: userId}, {}).lean()
        return res.status(200).json(currentCustomer)
        l


    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: err })
    }

}

module.exports = { getAllCustomer, getOneCustomer, addCustomer, updateCustomer, deleteCustomer, deleteListCustomer }
