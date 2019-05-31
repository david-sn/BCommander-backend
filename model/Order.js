var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderDetails = new Schema({
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipping", "completed", "cancelled", "refunded", "failed"]
    },
    currency: {
        type: String,
        required: true
    },
    customer_note: {
        type: String
    },
    store_note: {
        type: String
    },
    customer_details: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true }
    },
    shipping_address: {
        country: String,
        city: String,
        state: String,
        addressLine: String
    },
    payment_method: {
        type: String,
        required: true,
        enum: ["COD", "CREDIT"]
    },
    totalPriceOfOrder: {
        type: Number
    }

});

module.exports = mongoose.model('OrderDetails', OrderDetails, 'OrderDetails');
