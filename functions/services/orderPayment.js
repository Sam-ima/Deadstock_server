const admin = require("../firebaseAdmin");
const db = admin.firestore();

// services/orderPayment.js
async function createOrder({ userId, items, totalAmount,deliveryDetails }) {
  const productIds = items.map(item => item.product?.id || item.id); // <-- Only product IDs

  const orderRef = db.collection("orders").doc();

  await orderRef.set({
    userId,
    items: productIds,        // store only product IDs
    totalAmount,
    deliveryDetails: deliveryDetails || {}, // <-- store delivery info
    paymentMethod: "ESEWA",
    paymentStatus: "PENDING",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    orderId: orderRef.id,
    amount: totalAmount,
  };
}


async function markOrderPaid(orderId, refId) {
  await db.collection("orders").doc(orderId).update({
    paymentStatus: "PAID",
    refId,
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function markOrderFailed(orderId) {
  await db.collection("orders").doc(orderId).update({
    paymentStatus: "FAILED",
  });
}

module.exports = {
  createOrder,
  markOrderPaid,
  markOrderFailed,
};
