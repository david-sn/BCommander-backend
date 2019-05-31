var OrderDetails = require('../model/Order');
var ProductDetail = require('../model/Product');
var OrderItem = require('../model/OrderItem');


module.exports.createOrder = function (req, res) {

    let newOrder = new OrderDetails({
        status: "pending",
        currency: req.body.currency,
        customer_note: req.body.customer_note,
        store_note: req.body.store_note,
        customer_details: req.body.customer_details,
        payment_method: req.body.payment_method
    });
    newOrder.save(async (err, savedObj) => {
        if (err) {
            res.status(200).json({ status: "ERROR", error: err });
        } else {
            //loop at items wants to buy on order
            var totalPriceOfOrder = 0.0;
            for (let index = 0; index < req.body.products.length; index++) {
                const productObj = req.body.products[index];

                let pd = await ProductDetail.findById(productObj.id).exec();
                if (pd && pd.stock_quantity >= parseInt(productObj.quantity)) {
                    pd.stock_quantity = pd.stock_quantity - parseInt(productObj.quantity);
                    await pd.save();

                    let currentProductPrice = getProductCurrentPriceBasedOnQuntity(pd, parseInt(productObj.quantity));
                    totalPriceOfOrder = totalPriceOfOrder + currentProductPrice;

                    let newOrderItem = new OrderItem({
                        product_id: pd._id,
                        quantity: productObj.quantity,
                        order_id: savedObj._id
                    });
                    newOrderItem.save();
                } else {
                    await OrderDetails.findByIdAndRemove(savedObj._id);
                    return res.status(200).json({ status: "INSUFFICIENT_ITEM_QUNTITY" });
                }
            }
            savedObj.totalPriceOfOrder = totalPriceOfOrder;
            savedObj.save();
            res.status(200).json({ status: "OK", result: { orderId: savedObj._id } });
        }
    })


}

module.exports.updateOrder = function (req, res) {
    OrderDetails.findById(req.body.orderId).exec().then(async od => {
        if (od) {
            od.status = req.body.status ? req.body.status : od.status;
            od.currency = req.body.currency ? req.body.currency : od.currency;
            od.customer_note = req.body.customer_note ? req.body.customer_note : od.customer_note;
            od.store_note = req.body.store_note ? req.body.store_note : od.store_note;
            od.customer_details = req.body.customer_details ? req.body.customer_details : od.customer_details;
            od.payment_method = req.body.payment_method ? req.body.payment_method : od.payment_method;
            if (req.body.products) {//if need update products in order
                var totalPriceOfOrder = 0.0;
                for (let index = 0; index < req.body.products.length; index++) {
                    const productObj = req.body.products[index];

                    let pd = await ProductDetail.findById(productObj.id).exec();
                    if (pd && pd.stock_quantity >= parseInt(productObj.quantity)) {
                        pd.stock_quantity = pd.stock_quantity - parseInt(productObj.quantity);
                        await pd.save();

                        let currentProductPrice = getProductCurrentPriceBasedOnQuntity(pd, parseInt(productObj.quantity));
                        totalPriceOfOrder = totalPriceOfOrder + currentProductPrice;

                        let newOrderItem = new OrderItem({
                            product_id: pd._id,
                            quantity: productObj.quantity,
                            order_id: savedObj._id
                        });
                        newOrderItem.save();
                    } else {
                        await OrderDetails.findByIdAndRemove(savedObj._id);
                        return res.status(200).json({ status: "INSUFFICIENT_ITEM_QUNTITY" });
                    }
                }
                od.totalPriceOfOrder = totalPriceOfOrder;
            }
            od.save((err, savedObj) => {
                if (err) {
                    res.status(200).json({ status: "ERROR", error: err });
                } else
                    res.status(200).json({ status: "OK", result: savedObj });
            })
        } else {
            res.status(200).json({ status: "DATA_NOT_FOUND" });
        }
    })
}

module.exports.cancelOrder = function (req, res) {
    OrderDetails.findById(req.body.orderId).exec().then(od => {
        if (od) {
            od.status = "cancelled";
            od.save((err, savedObj) => {
                if (err) {
                    res.status(200).json({ status: "ERROR", error: err });
                } else
                    res.status(200).json({ status: "OK", result: savedObj });
            })

        } else {
            res.status(200).json({ status: "DATA_NOT_FOUND" });
        }
    })
}

module.exports.shippingOrder = function (req, res) {
    OrderDetails.findById(req.body.orderId).exec().then(od => {
        if (od) {
            od.status = "shipping";
            od.shipping_address = {
                country: req.body.country,
                city: req.body.city,
                state: req.body.state,
                addressLine: req.body.addressLine
            }
            od.save((err, savedObj) => {
                if (err) {
                    res.status(200).json({ status: "ERROR", error: err });
                } else
                    res.status(200).json({ status: "OK", result: savedObj });
            })

        } else {
            res.status(200).json({ status: "DATA_NOT_FOUND" });
        }
    })
}

module.exports.getAllOrder = function (req, res) {
    OrderDetails.find()
        .limit(parseInt(req.body.pageSize))
        .skip(parseInt(req.body.pageSize) * parseInt(req.body.page))
        .exec().then(ods => {
            res.status(200).json({ status: "OK", result: ods });
        })
}

module.exports.getOrderDetails = function (req, res) {
    OrderDetails.findById(req.body.orderId)
        .exec().then(async od => {
            if (od) {

                res.status(200).json({ status: "OK", result: await generateOrderTemplete(od) })
            } else {
                res.status(200).json({ status: "DATA_NOT_FOUND" });
            }
        })
}


async function generateOrderTemplete(order) {
    let orderItems = await OrderItem.find({ order_id: order._id }).exec();
    let productsView = [];
    if (orderItems.length > 0) {
        for (let index = 0; index < orderItems.length; index++) {
            const orderItemDB = orderItems[index];
            let pDetailsDB = await ProductDetail.findById(orderItemDB.product_id).exec()
            productsView.push({ productDetail: pDetailsDB, quantity: orderItemDB.quantity });
        }
        order.products = productsView;

        return {
            "customer_details": order.customer_details,
            "shipping_address": order.shipping_address,
            "_id": order._id,
            "status": order.status,
            "currency": order.currency,
            "customer_note": order.customer_note,
            "store_note": order.store_note,
            "payment_method": order.payment_method,
            "totalPriceOfOrder": order.totalPriceOfOrder,
            products: productsView


        };
    }
}

function getProductCurrentPriceBasedOnQuntity(product, quantity) {
    let datePurshase = new Date();
    if ((product.date_on_sale_from && product.date_on_sale_to) && (datePurshase > product.date_on_sale_from && datePurshase < product.date_on_sale_to)) {
        console.log("SALE--YES")
        return quantity * product.sale_price;
    } else {
        console.log("SALE--NO")
        return quantity * product.regular_price;
    }
}