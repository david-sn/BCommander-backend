var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductItem = new Schema({
    product_id: {
        type: String
    },
    quantity: {
        type: Number
    },
    order_id: {
        type: String
    }
});

module.exports = mongoose.model('ProductItem', ProductItem, 'ProductItem');
