const User = require("../models/user");
const { use } = require("../routes/user");
const Order = require("../models/order");

exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec( (err,user) => {
        if(err || !user){
            return res.status(404).json({
                error : "No record found !!!"
            })
        }
        req.profile = user
        next();
    })
}

exports.getUser = (req,res) => {
    req.profile.encry_password = undefined;
    req.profile.salt = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile)
}

exports.getAllUsers = (req,res) => {
    User.find().exec( (err,user) => {
        if(err || !user) {
            return res.status(404).json({
                error : "Data Not Found"
            })
        }
        // modifing users information
        user.forEach(res => {
            res.encry_password = undefined,
            res.salt = undefined
        })
        return res.json(user);
    }) 
}

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set : req.body},
        {new: true, useFindAndModify: false},
        (err,user) => {
            if(err || !user){
                return res.status(403).json({
                    error : "You are not authorized to change info"
                })
            }
            user.salt = undefined,
            user.encry_password = undefined
            return res.json(user);
        }
    )
}

exports.userPurchaseList = (req,res) => {
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error : "No order in this account"
            })
        }
        return res.json(order)
    })
}

exports.pushOrderInPurchaseList = (req,res,next) => {
    let purchases = [];
    req.body.order.purchases.forEach(product => {
        purchases.push({
            _id : product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    })

    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases:purchases}},
        {new:true},
        (err,purchases) => {
            if(err){
                return res.status(400).json({
                    error : "Unable to save purchase list"
                })
            }
            next();
        }
    )
    next();
}