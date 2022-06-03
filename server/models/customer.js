const mongoose = require('mongoose')
const Order = require('./order')

const addressSchema = new mongoose.Schema({
    _id: false,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    postcode: { type: Number, required: true },
    suburb: { type: String, required: true },
    state: { type: String, enum: ["ACT", "NSW", "NT", "QLD", "SA", "VIC", "TAS", "WA"], required: true}
})

// Customer model
const customerSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
    givenName: { type: String, require: true },
    familyName: { type: String, require: true },
    emailAddress: { type: String, require: true },
    phoneNumber: { type: Number, require: true},
    companyName: { type: String, require: true },
    address: { type: String },
    abn: { type: Number, require: true },
    notes : String
})

customerSchema.index({ "userId": 1, "emailAddress": 1, "phoneNumber": 1, "abn":1 }, { unique: true });
const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer