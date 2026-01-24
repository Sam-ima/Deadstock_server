const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderPaymentController");

router.post("/esewa/initiate", controller.initiateEsewaPayment);
router.get("/esewa/success", controller.esewaSuccess);
router.get("/esewa/failure", controller.esewaFailure);

module.exports = router;
