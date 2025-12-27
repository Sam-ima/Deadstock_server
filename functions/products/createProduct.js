const functions = require("firebase-functions");
const { db } = require("../config/firebase");

exports.createProduct = functions.https.onCall(async (data, context) => {
  if (!context.auth || !["admin_b2b", "admin_b2c"].includes(context.auth.token.role)) {
    throw new functions.https.HttpsError("permission-denied");
  }

  await db.collection("products").add({
    ...data,
    status: "active",
    createdAt: new Date(),
  });

  return { success: true };
});
