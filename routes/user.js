const express = require("express");
var router = express.Router();

const { getUserById, getUser, getAllUsers, updateUser, userPurchaseList } = require("../controllers/user");
const { isAuthenticated, isAdmin, isSignedIn } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated,  getUser);

router.get("/users", getAllUsers);

router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)

router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)

module.exports = router;