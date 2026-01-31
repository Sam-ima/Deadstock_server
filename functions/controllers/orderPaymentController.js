// backend/controllers/payment.controller.js
const { admin, db } = require("../firebaseAdmin");
const crypto = require("crypto");
const { createCommissionTransactions } = require( "../services/commissionService");
const {
  createOrder,
  markOrderPaid,
  markOrderFailed,
} = require("../services/orderPayment");

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
  },
};

const config =
  process.env.NODE_ENV === "production" ? ESEWA_CONFIG.live : ESEWA_CONFIG.test;

/**
 * Initiate eSewa payment
 */
async function initiateEsewaPayment(req, res) {
  try {
    const { userId, items, totalAmount, deliveryDetails } = req.body;

    // Validate input (keep your existing validation)
    if (
      !userId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !totalAmount
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment data",
      });
    }

    // Generate unique transaction ID
    const transactionUuid = `ESEWA_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate amounts
    const amount = Math.max(1, Math.round(Number(totalAmount)));
    const baseUrl = "http://localhost:4000/api/payment";
    // ✅ FIX: CREATE ORDER IN FIRESTORE FIRST
    const { orderId } = await createOrder({
      userId,
      items,
      totalAmount: amount,
      deliveryDetails,
      transactionUuid, // Use the same transaction ID
    });

    // console.log("Order created in Firebase with ID:", orderId);

    // Prepare payload with the actual orderId
    const payload = {
      amount: amount.toString(),
      tax_amount: "0",
      product_service_charge: "0",
      product_delivery_charge: "0",
      total_amount: amount.toString(),
      transaction_uuid: transactionUuid,
      product_code: "EPAYTEST",
      // ✅ Use the actual Firebase order ID
      success_url: `${baseUrl}/esewa/success?orderId=${orderId}&transaction_uuid=${transactionUuid}`,
      failure_url: `${baseUrl}/esewa/failure?orderId=${orderId}&transaction_uuid=${transactionUuid}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    // Generate signature
    const signatureData = `total_amount=${payload.total_amount},transaction_uuid=${payload.transaction_uuid},product_code=${payload.product_code}`;
    const secretKey = "8gBm/:&EnhH.1/q";
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(signatureData)
      .digest("base64");

    payload.signature = signature;

    // Return the payload
    return res.json({
      success: true,
      orderId, // ✅ Include orderId in response
      transactionUuid,
      ...payload,
    });
  } catch (error) {
    console.error("Error in initiateEsewaPayment:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
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
    const decodedData = Buffer.from(data, "base64").toString("utf-8");
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

      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
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

    // console.log("Payment success callback:", {
    //   orderId,
    //   transaction_uuid,
    //   ref_id,
    // });

    if (orderId) {
      await markOrderPaid(orderId, ref_id || transaction_uuid);
      // 2. Get the order data
      const orderDoc = await admin.firestore().collection("orders").doc(orderId).get();
      
      if (orderDoc.exists) {
        const orderData = orderDoc.data();
        
        // 3. Create commission transactions
        await createCommissionTransactions(orderId, orderData);
    }
  }
    // Redirect to frontend success page
    res.redirect(
      `http://localhost:5173/checkout?status=success&orderId=${orderId || ""}`,
    );
  } catch (err) {
    console.error("Success callback error:", err);
    res.redirect(
      `http://localhost:5173/checkout?status=failed&error=Payment verification failed`,
    );
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
    res.redirect(
      `http://localhost:5173/checkout?status=failed&orderId=${orderId || ""}&error=${encodeURIComponent(error || "Payment failed")}`,
    );
  } catch (err) {
    console.error("Failure callback error:", err);
    res.redirect(
      `http://localhost:5173/checkout?status=failed&error=Payment processing error`,
    );
  }
}

module.exports = {
  initiateEsewaPayment,
  verifyEsewaPayment,
  paymentSuccessCallback,
  paymentFailureCallback,
};
