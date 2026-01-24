const {
  createOrder,
  markOrderPaid,
  markOrderFailed,
} = require("../services/orderPayment");

/**
 * Initiate eSewa payment
 */
async function initiateEsewaPayment(req, res) {
  try {
    const { userId, items, totalAmount,deliveryDetails } = req.body;

    if (!userId || !items?.length || !totalAmount) {
      return res.status(400).json({ error: "Invalid payment data" });
    }

    const { orderId, amount } = await createOrder({
      userId,
      items,
      totalAmount,
      deliveryDetails, // <-- pass it here
    });

    // Official eSewa test requires:
    res.json({
      amt: amount, // Number
      psc: 0,
      pdc: 0,
      tAmt: amount, // Total amount
      pid: orderId, // Order ID
      scd: "EPAYTEST", // Test merchant code
      su: "http://localhost:4000/api/payment/esewa/success",
      fu: "http://localhost:4000/api/payment/esewa/failure",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to initiate payment" });
  }
}

/**
 * eSewa success callback
 */
async function esewaSuccess(req, res) {
  const { oid, refId } = req.query;

  try {
    // Mark order paid in Firestore
    await markOrderPaid(oid, refId || "ESEWA_TEST_REF");
    res.redirect("http://localhost:5173/payment-success");
  } catch (err) {
    await markOrderFailed(oid);
    res.redirect("http://localhost:5173/payment-failed");
  }
}

/**
 * eSewa failure callback
 */
async function esewaFailure(req, res) {
  const { oid } = req.query;
  await markOrderFailed(oid);
  res.redirect("http://localhost:5173/payment-failed");
}

module.exports = {
  initiateEsewaPayment,
  esewaSuccess,
  esewaFailure,
};
