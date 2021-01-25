const express = require("express");
var router = express.Router();

const {
    getCategoryById, 
    getCategory, 
    getAllCategory, 
    updateCategory,
    removeCategory,
    createCategory
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

// route params
router.param("categoryId", getCategoryById)
router.param("userId", getUserById)

// actual routes

// create
router.post(
    "/category/create/:userId", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin,
    createCategory
);

// read
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

// update
router.put(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);

//delete
router.delete(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategory
);

module.exports = router;
