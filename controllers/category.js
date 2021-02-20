const Category = require("../models/category");

// get category by it
exports.getCategoryById = ( req, res, next, id) => {
    Category.findById(id).exec((err,cat) => {
        if(err){
            return res.status(400).json({
                error : "Category Not Found"
            })
        }
        req.category = cat;
        next();
    })
}

// create and save category in db
exports.createCategory = ( req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error : "Not able to save category"
            })
        }
        res.json(category)
    })
}

// get single category
exports.getCategory = (req, res) => {
    return res.json(req.category);
}

// get all categories
exports.getAllCategory = (req, res) => {
    Category.find().exec((err, items) => {
        if(err){
            return res.status(400).json({
                error : "Categories Not Found"
            })
        }
        res.json(items)
    })
}

// update category
exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error : "Categories Not Found"
            })
        }
        res.json(updatedCategory);
    })
}

// delete category
exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                error : `Failed to remove ${category.name}`
            })
        }
        res.json({
            message : `${category.name} successfully deleted`
        })
    })
}