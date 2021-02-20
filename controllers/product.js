const Product = require("../models/product");
const formidable  = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = ( req, res, next, id ) => {
    Product.findById(id).exec((err,product) => {
        if(err){
            return res.status(400).json({
                error : "Product not found !!!"
            })
        }
        req.product = product;
        next();
    })
}

exports.createProduct = ( req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error : "Problem with image"
            })
        }
        // handling the response
        const { name, description, price, stock, category } = fields;
        if(!name || !description || !price || !stock || !category){
            return res.status(400).json({
                error: "Fields are missing !!!"
            })
        }

        let product = new Product(fields);

        // handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "File is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        // save to the DB
        console.log("final products", product)
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to update product information"
                })
            }
            res.json(product);
        })
    })
}

// get single product from DB

exports.getProduct = ( req, res ) => {
    req.product.photo = undefined
    return res.json(req.product);
}

// middleware for photo
exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
}

// delete product from DB
exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err, product) => {
        if(err){
            return res.status(400).json({
                error : "Unable to delete product"
            })
        }
        res.json({
            message : "Product deleted successfully",
            deleted : product 
        })
    })
}

//update product
exports.updateProduct = (req,res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error : "Problem with image"
            })
        }
        
        let product = req.product;
        product = _.extend(product, fields);

        // handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "File is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        // save to the DB
        console.log("final products", product)
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save product information"
                })
            }
            res.json(product);
        })
    })
}

// get all the products
exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? req.query.limit : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
    .select("-photo")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((err,products) => {
        if(err){
            return res.status(400).json({
                error : "Error : Unable to fetch products"
            })
        }
        res.json(products);
    })
}

// middleware for updating stock and sold
exports.updateStock = (req, res, next) => {
    
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: {$inc: {stock: -prod.count,sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, count) => {
        if(err){
            return res.status(400).json({
                error: "Bulk operation failed"
            })
        }
        next();
    })
}

// get all product categories
exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category", {}, (err,category) => {
        if(err){
            return res.status(400).json({
                error: "No Categories Found"
            })
        }
        res.json(category);
    })
}