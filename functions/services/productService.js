const admin = require("../firebaseAdmin");
const db = admin.firestore();

/**
 * Fetch all products eligible for depreciation/appreciation
 */
async function fetchDepreciatingProducts() {
  const snapshot = await db
    .collection("products")
    .where("isDepreciating", "==", true)
    .get();

  const products = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();

    let categoryName = "unknown";

    if (data.categoryId) {
      const catSnap = await db.collection("categories").doc(data.categoryId).get();
      if (catSnap.exists) {
        categoryName = catSnap.data().name; // e.g. "electronics"
      }
    }

    products.push({
      id: doc.id,
      ...data,
      categoryName,
    });
  }

  return products;
}

/**
 * Update product price and depreciation count
 */
async function updateProductPrice(productId, newPrice, depreciationCount) {
  await db.collection("products").doc(productId).update({
    currentPrice: newPrice,
    depreciationCount: depreciationCount,
    lastDepreciatedAt: new Date(),
  });
}

module.exports = { fetchDepreciatingProducts, updateProductPrice };
