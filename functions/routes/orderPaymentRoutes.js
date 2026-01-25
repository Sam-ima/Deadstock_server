// backend/routes/payment.routes.js
const express = require("express");
const router = express.Router();
const {
  initiateEsewaPayment,
  verifyEsewaPayment,
  paymentSuccessCallback,
  paymentFailureCallback,
} = require("../controllers/orderPaymentController");

router.get("/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({
    success: true,
    message: "Payment endpoint is working",
    timestamp: new Date().toISOString()
  });
});

// Test eSewa payload generation
router.get("/test-payload", (req, res) => {
  const crypto = require("crypto");
  
  const transactionUuid = `TEST_${Date.now()}`;
  const amount = "100";
  
  const payload = {
    amount: amount,
    tax_amount: "0",
    product_service_charge: "0",
    product_delivery_charge: "0",
    total_amount: amount,
    transaction_uuid: transactionUuid,
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/checkout?status=success",
    failure_url: "http://localhost:5173/checkout?status=failed",
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };

  const signatureData = `total_amount=${payload.total_amount},transaction_uuid=${payload.transaction_uuid},product_code=${payload.product_code}`;
  const secretKey = "8gBm/:&EnhH.1/q";
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureData)
    .digest("base64");

  payload.signature = signature;

  res.json({
    success: true,
    message: "Test payload generated",
    payload: payload
  });
});

// Initiate eSewa payment
router.post("/esewa/initiate", initiateEsewaPayment);

// eSewa payment verification (webhook)
router.post("/esewa/verify", verifyEsewaPayment);

// Payment callbacks (for direct redirects)
router.get("/esewa/success", paymentSuccessCallback);
router.get("/esewa/failure", paymentFailureCallback);

module.exports = router;