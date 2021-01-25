const express = require("express");
var router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { 
    getProductById, 
    createProduct, 
    getProduct, 
    photo,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getAllUniqueCategories 
} = require("../controllers/product");

// router params
router.param("productId", getProductById);
router.param("userId", getUserById);

// actual routes

// post route
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)

// read route
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo);

// delete route
router.delete(
    "/product/:productId/:userId", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    deleteProduct
)

// update route
router.put(
    "/product/:productId/:userId", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    updateProduct
)

// listing products
router.get("/products", getAllProducts)
router.get("/products/categories", getAllUniqueCategories)

module.exports = router