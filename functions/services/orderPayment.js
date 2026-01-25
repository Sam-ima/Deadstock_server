const admin = require("../firebaseAdmin");
const db = admin.firestore();

async function createOrder({ userId, items, totalAmount, deliveryDetails, transactionUuid }) {
  const productIds = items.map(item => item.product?.id || item.id);

  const orderRef = db.collection("orders").doc();

  await orderRef.set({
    userId,
    items: productIds,
    totalAmount,
    deliveryDetails: deliveryDetails || {},
    paymentMethod: "ESEWA",
    paymentStatus: "PENDING",
    transactionUuid, // ✅ STORE THIS
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    orderId: orderRef.id,
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
