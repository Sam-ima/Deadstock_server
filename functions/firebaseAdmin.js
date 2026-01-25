const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKeys.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://deadstock-bca95-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
}

module.exports = admin;
