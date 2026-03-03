const functions = require("firebase-functions");
const { db } = require("../config/firebase");

exports.getProducts = functions.https.onCall(async () => {
  const snapshot = await db.collection("products").get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
});
