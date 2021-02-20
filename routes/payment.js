const express = require("express");
var router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const { getToken, processPayment } = require("../controllers/payment");

router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

router.post("/payment/checkout/:userId", isSignedIn, isAuthenticated, processPayment);

module.exports = router;