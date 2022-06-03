const Product = require('../models/product');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');

// add product
const addProduct = async (req, res) => {
    let userId = new ObjectId(req.user._id);
    let name = req.body.name;
    let tag = name.toLowerCase().replace(/\s+/g, ' ').trim().replace(' ', '-');
    const newProduct = new Product({
        tag: tag,
        name: name,
        description: req.body.description,
        available: req.body.available,
        userId: userId
    });

    await newProduct.save((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ msg: err });
        }
        console.log("Product", newProduct.tag, "added successfully!");
        return res.status(200).json(newProduct);
    })
}

// update product information
const updateProduct = async (req, res) => {
    let userId = new ObjectId(req.user._id);
    userId = new ObjectId(userId);
    let productRequest = req.params.tag
    try {
        let productName = req.body.name;
        let productDescription = req.body.description;
        let productAvailable = req.body.available

        // update field that changed
        if (productName) {
            let productTag = productName.toLowerCase().replace(/\s+/g, ' ').trim().replace(' ', '-');
            await Product.updateOne({ userId: userId, tag: productRequest }, { $set: { tag: productTag } })
            productRequest = productTag;
            await Product.updateOne({ userId: userId, tag: productRequest }, { $set: { name: productName } })
        }
        if (productDescription) {
            await Product.updateOne({ userId: userId, tag: productRequest }, { $set: { description: productDescription } })
        }
        if (productAvailable !== null) {
            await Product.updateOne({ userId: userId, tag: productRequest }, { $set: { available: productAvailable } })
        }

        let product = await Product.findOne({ userId: userId, tag: productRequest });
        if (product) {
            console.log("Update product successfully")
            return res.status(200).json(product);
        } else {
            console.log("could not find product")
            return res.status(500).json({ msg: 'could not find product' })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: err })
    }
}

// delete product 
const deleteProduct = async (req, res) => {
    let userId = new ObjectId(req.user._id);
    userId = new ObjectId(userId);
    let productTag = req.params.tag;
    await Product.findOneAndDelete({ userId: userId, tag: productTag })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json({ msg: err }));
}

// get particular product
const getOneProduct = async (req, res) => {
    let userId = req.cookies['userId'];
    userId = new ObjectId(userId);
    try {
        // find the product
        const product = await Product.find({ userId: userId, tag: req.params.tag }, { tag: true, name: true, price: true, photo: true, description: true, available: 'true' }).lean()
        // if product does not exist
        if (product.length == 0) {
            console.log("Product does not exist!")
            return res.status(400).json({ msg: 'Product does not exist!' })
        }
        res.send(product)
    } catch (err) {
        console.log("Database query 'menu' failed!")
        return res.status(500).json({ msg: err })
    }
}

// get all product
const getAllProduct = async (req, res) => {
    let userId = new ObjectId(req.user._id);
    userId = new ObjectId(userId)
    try {
        const products = await Product.find({ userId: userId }, { _id: false, userId: false }).lean()
        return res.status(200).json(products)
    } catch (err) {
        console.log("failed to get product to the database!")
        return res.status(500).json({ msg: err });
    }
}

// get all available product
const getAvailableProduct = async (req, res) => {
    let userId = new ObjectId(req.user._id);
    console.log(userId)
    userId = new ObjectId(userId)
    try {
        const availableProducts = await Product.find({ userId: userId, available: 'true' }, { _id: false, userId: false }).lean()

        if (availableProducts.length == 0) {
            return res.json("No available product")
        }

        return res.status(200).json(availableProducts)
    } catch (err) {
        console.log("failed to get available product to the database!")
        return res.status(500).json({ msg: err });
    }


}

module.exports = { addProduct, updateProduct, deleteProduct, getOneProduct, getAllProduct, getAvailableProduct }