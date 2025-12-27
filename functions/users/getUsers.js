const functions = require("firebase-functions");
const { db } = require("../config/firebase");

exports.getUsers = functions.https.onCall(async (_, context) => {
  if (context.auth?.token.role !== "super_admin") {
    throw new functions.https.HttpsError("permission-denied");
  }

  const snapshot = await db.collection("users").get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
});
