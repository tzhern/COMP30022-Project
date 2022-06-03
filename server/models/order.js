const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    _id: false,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
})

// Sales model
const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, required: true, ref: "User"},
    customerId: { type: mongoose.Types.ObjectId, required: true, ref: "Customer" },
    status: { type: String, enum: ["ongoing", "completed", "cancelled"] },
    details: { type: [cartSchema], required: true },
    total: { type: Number },
}, { timestamps: { createdAt: 'orderTime', updatedAt: 'updateTime'} })

const Order = mongoose.model('Order', orderSchema)
module.exports = Order