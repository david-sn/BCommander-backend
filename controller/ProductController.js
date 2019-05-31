var ProductDetails = require('../model/Product');


module.exports.addProduct = function (req, res) {

    let newProduct = new ProductDetails({
        name: req.body.name,
        slug: req.body.slug,
        image: req.body.image,
        description: req.body.description,
        regular_price: req.body.regular_price,
        sale_price: req.body.sale_price,
        date_on_sale_from: req.body.date_on_sale_from,
        date_on_sale_to: req.body.date_on_sale_to,
        manage_stock: req.body.manage_stock,
        stock_quantity: req.body.stock_quantity,
        sku: req.body.sku
    });
    newProduct.save((err, savedObj) => {
        if (err) {
            res.status(200).json({ status: "ERROR", error: err });
        } else
            res.status(200).json({ status: "OK", result: savedObj });
    })

}

module.exports.updateProduct = function (req, res) {
    ProductDetails.findById(req.body.productId).exec().then(pd => {

        if (pd) {
            pd.name = req.body.name ? req.body.name : pd.name;
            pd.slug = req.body.slug ? req.body.slug : pd.slug;
            pd.image = req.body.image ? req.body.image : pd.image;
            pd.description = req.body.description ? req.body.description : pd.description;
            pd.regular_price = req.body.regular_price ? req.body.regular_price : pd.regular_price;
            pd.sale_price = req.body.sale_price ? req.body.sale_price : pd.sale_price;
            pd.date_on_sale_from = req.body.date_on_sale_from ? req.body.date_on_sale_from : pd.date_on_sale_from;
            pd.date_on_sale_to = req.body.date_on_sale_to ? req.body.date_on_sale_to : pd.date_on_sale_to;
            pd.manage_stock = req.body.manage_stock ? req.body.manage_stock : pd.manage_stock;
            pd.stock_quantity = req.body.stock_quantity ? req.body.stock_quantity : pd.stock_quantity;
            pd.sku = req.body.sku ? req.body.sku : pd.sku;

            pd.save((err, savedObj) => {
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

module.exports.deleteProduct = function (req, res) {
    ProductDetails.findById(req.body.productId).exec().then(pd => {
        if (pd) {
            ProductDetails.findByIdAndRemove(req.body.productId, function (err) {
                if (err)
                    res.status(200).json({ status: "ERROR", error: err });
                else
                    res.status(200).json({ status: "OK" });
            });
        } else {
            res.status(200).json({ status: "DATA_NOT_FOUND" });
        }
    })
}


module.exports.getAllProduct = function (req, res) {

    ProductDetails.find()
        .limit(parseInt(req.body.pageSize))
        .skip(parseInt(req.body.pageSize) * parseInt(req.body.page))
        .exec().then(products => {

            ProductDetails.count().exec().then(totalCount => {
                res.status(200).json({
                    status: "OK",
                    totalCount: totalCount,
                    result: products,
                })
            })

        })
}


module.exports.getProductDetail = function (req, res) {

    ProductDetails.findById(req.body.productId).exec().then(pd => {
        if (pd) {
            res.status(200).json({ status: "OK", result: pd })
        } else {
            res.status(200).json({ status: "DATA_NOT_FOUND" });
        }
        
    })
}