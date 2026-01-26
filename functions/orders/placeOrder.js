const functions = require("firebase-functions");
const { admin, db } = require("../config/firebase");

exports.placeOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }

  const { buyerType, items } = data;

  if (buyerType === "b2b") {
    items.forEach(item => {
      if (item.qty < item.minOrderQty) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Minimum B2B quantity not met"
        );
      }
    });
  }

  const batch = db.batch();

  for (const item of items) {
    const ref = db.collection("products").doc(item.productId);
    batch.update(ref, {
      stock: admin.firestore.FieldValue.increment(-item.qty),
    });
  }

  const orderRef = db.collection("orders").doc();
  batch.set(orderRef, {
    userId: context.auth.uid,
    buyerType,
    items,
    status: "pending",
    createdAt: new Date(),
  });

  await batch.commit();
  return { success: true };
});
