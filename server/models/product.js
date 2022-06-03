const mongoose = require("mongoose")

// Product model
const productSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, require: true, ref:"User" },
    tag: { type: String, require: true },
    name: { type: String, require: true },
    available: { type: Boolean, default:true, require: true},
    description: String
})
productSchema.index({ "userId": 1, "tag": 1 }, { unique: true });
const Product = mongoose.model('Product', productSchema)
module.exports = Product