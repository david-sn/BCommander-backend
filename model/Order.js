var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderDetails = new Schema({
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipping", "completed", "cancelled", "refunded", "failed"]
    },
    currency: {
        type: String
    },
    customer_note: {
        type: String
    },
    store_note: {
        type: String
    },
    customer_details: {
        firstName: String,
        lastName: String,
        phoneNumber: String,
        email: String
    },
    shipping_address: {
        country: String,
        city: String,
        state: String,
        addressLine: String
    },
    payment_method: {
        type: String,
        enum: ["COD", "CREDIT"]
    },
    totalPriceOfOrder:{
        type:Number
    }

});

module.exports = mongoose.model('OrderDetails', OrderDetails, 'OrderDetails');
