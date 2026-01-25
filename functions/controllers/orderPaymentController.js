// backend/controllers/payment.controller.js
const crypto = require("crypto");
const { createOrder, markOrderPaid, markOrderFailed } = require("../services/orderPayment");

// Environment configuration
const ESEWA_CONFIG = {
  test: {
    baseUrl: "https://rc-epay.esewa.com.np",
    productCode: "EPAYTEST",
    secretKey: "8gBm/:&EnhH.1/q",
  },
  live: {
    baseUrl: "https://epay.esewa.com.np",
    productCode: "YOUR_LIVE_PRODUCT_CODE",
    secretKey: "YOUR_LIVE_SECRET_KEY",
  }
};

const config = process.env.NODE_ENV === 'production' ? ESEWA_CONFIG.live : ESEWA_CONFIG.test;

/**
 * Initiate eSewa payment
 */
async function initiateEsewaPayment(req, res) {
  console.log("=== INITIATE ESEWA PAYMENT CALLED ===");
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);

  try {
    const { userId, userEmail, items, totalAmount, deliveryDetails } = req.body;

    // Validate input
    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      console.error("Validation failed:", { 
        userId: !!userId, 
        items: items?.length, 
        totalAmount: !!totalAmount 
      });
      
      return res.status(400).json({ 
        success: false,
        error: "Invalid payment data",
        details: {
          userId: !!userId,
          itemsCount: items?.length || 0,
          totalAmount: !!totalAmount,
          message: "Please provide userId, items array, and totalAmount"
        }
      });
    }

    // Generate unique transaction ID
    const transactionUuid = `ESEWA_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    console.log("Generated transaction_uuid:", transactionUuid);

    // Create order ID
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    console.log("Generated orderId:", orderId);

    // Calculate amounts
    const amount = Math.max(1, Math.round(Number(totalAmount))); // Minimum 1 NPR
    console.log("Amount calculated:", amount);

    // Prepare payload (ALL VALUES AS STRINGS)
    const payload = {
      amount: amount.toString(),
      tax_amount: "0",
      product_service_charge: "0",
      product_delivery_charge: "0",
      total_amount: amount.toString(), // Same as amount since no extra charges
      transaction_uuid: transactionUuid,
      product_code: "EPAYTEST", // TEST ENVIRONMENT
      success_url: `http://localhost:5173/checkout?status=success&orderId=${orderId}`,
      failure_url: `http://localhost:5173/checkout?status=failed&orderId=${orderId}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    console.log("Payload before signature:", JSON.stringify(payload, null, 2));

    // Generate signature
    const signatureData = `total_amount=${payload.total_amount},transaction_uuid=${payload.transaction_uuid},product_code=${payload.product_code}`;
    console.log("Signature data string:", signatureData);

    const secretKey = "8gBm/:&EnhH.1/q"; // Test secret key
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(signatureData)
      .digest("base64");

    console.log("Generated signature:", signature);

    // Add signature to payload
    payload.signature = signature;

    // Log complete payload
    console.log("\n=== FINAL PAYLOAD TO SEND ===");
    Object.entries(payload).forEach(([key, value]) => {
      console.log(`${key.padEnd(25)}: ${value}`);
    });
    console.log("=============================\n");

    // Return the payload
    return res.json({
      success: true,
      ...payload
    });

  } catch (error) {
    console.error("Error in initiateEsewaPayment:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
/**
 * Verify eSewa payment (webhook callback)
 * eSewa will call this endpoint with payment data
 */
async function verifyEsewaPayment(req, res) {
  try {
    const { data, signature } = req.body;
    
    if (!data || !signature) {
      return res.status(400).json({ error: "Missing payment data" });
    }

    // Decode the data
    const decodedData = Buffer.from(data, 'base64').toString('utf-8');
    const paymentData = JSON.parse(decodedData);
    
    console.log("eSewa payment verification:", paymentData);

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", config.secretKey)
      .update(data)
      .digest("base64");

    if (signature !== expectedSignature) {
      console.error("Signature verification failed");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Find order by transaction_uuid
    const { transaction_uuid, status, total_amount, ref_id } = paymentData;
    
    if (status === "COMPLETE") {
      // Update order as paid
      await markOrderPaid(transaction_uuid, ref_id);
      
      // Send confirmation email (implement your email service)
      // await sendConfirmationEmail(paymentData);
      
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      await markOrderFailed(transaction_uuid);
      return res.status(400).json({ error: "Payment not completed" });
    }

  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
}

/**
 * Handle payment success callback (optional - for direct redirects)
 */
async function paymentSuccessCallback(req, res) {
  try {
    const { orderId, transaction_uuid, ref_id } = req.query;
    
    console.log("Payment success callback:", { orderId, transaction_uuid, ref_id });
    
    if (orderId) {
      await markOrderPaid(orderId, ref_id || transaction_uuid);
    }
    
    // Redirect to frontend success page
    res.redirect(`http://localhost:5173/checkout?status=success&orderId=${orderId || ''}`);
    
  } catch (err) {
    console.error("Success callback error:", err);
    res.redirect(`http://localhost:5173/checkout?status=failed&error=Payment verification failed`);
  }
}

/**
 * Handle payment failure callback
 */
async function paymentFailureCallback(req, res) {
  try {
    const { orderId, error } = req.query;
    
    console.log("Payment failure callback:", { orderId, error });
    
    if (orderId) {
      await markOrderFailed(orderId, error || "Payment failed");
    }
    
    // Redirect to frontend failure page
    res.redirect(`http://localhost:5173/checkout?status=failed&orderId=${orderId || ''}&error=${encodeURIComponent(error || 'Payment failed')}`);
    
  } catch (err) {
    console.error("Failure callback error:", err);
    res.redirect(`http://localhost:5173/checkout?status=failed&error=Payment processing error`);
  }
}

module.exports = {
  initiateEsewaPayment,
  verifyEsewaPayment,
  paymentSuccessCallback,
  paymentFailureCallback,
};