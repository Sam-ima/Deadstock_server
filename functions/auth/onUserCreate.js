const functions = require("firebase-functions");
const { auth } = require("../config/firebase");

exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== "super_admin") {
    throw new functions.https.HttpsError("permission-denied");
  }

  const { uid, role } = data;
  await auth.setCustomUserClaims(uid, { role });

  return { success: true };
});
