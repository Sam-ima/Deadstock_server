const { admin, db } = require("../firebaseAdmin");

async function createOrder({
  userId,
  items, // items from frontend should have product object
  totalAmount,
  deliveryDetails,
  transactionUuid,
}) {
  const orderRef = db.collection("orders").doc();

  // Create proper item structure with all details needed for commission
  const orderItems = items.map((item) => {
    const product = item.product || item;
    return {
      productId: product.id,
      sellerId: product.sellerId, // ⭐ CRITICAL: Make sure product has sellerId
      name: product.name || product.title,
      price: product.price || product.basePrice || 0,
      quantity: item.quantity || 1,
      // Calculate subtotal
      subtotal:
        (product.price || product.basePrice || 0) * (item.quantity || 1),
    };
  });

  await orderRef.set({
    userId,
    items: orderItems, // ⭐ Store full objects, not just IDs
    totalAmount,
    deliveryDetails: deliveryDetails || {},
    paymentMethod: "ESEWA",
    paymentStatus: "PENDING",
    transactionUuid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    paidAt: null,
    refId: null,
  });

  return { orderId: orderRef.id };
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
