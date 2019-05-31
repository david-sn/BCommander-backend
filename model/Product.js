var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductDetails = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {//slug is url friendly string
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    regular_price: {
        type: String,
        required: true
    },
    sale_price: {
        type: String
    },
    date_on_sale_from: {
        type: Date
    },
    date_on_sale_to: {
        type: Date
    },
    manage_stock: {
        type: Boolean,
        default: false
    },
    stock_quantity: {
        type: Number
    },
    sku: {
        type: String,
        unique: true
    },
    


});

module.exports = mongoose.model('ProductDetails', ProductDetails, 'ProductDetails');
