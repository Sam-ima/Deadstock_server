const { db } = require("../firebaseAdmin");

async function fetchDepreciatingProducts() {
  const snapshot = await db.collection("products")
    .where("isDepreciating", "==", true)
    .where("status", "==", "active")
    .get();

  const products = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    let categoryName = "unknown";

    if (data.categoryId) {
      const catSnap = await db.collection("categories").doc(data.categoryId).get();
      if (catSnap.exists) categoryName = catSnap.data().name.toLowerCase();
    }

    products.push({
      id: doc.id,
      ...data,
      categoryName
    });
  }

  return products;
}

async function updateProductPrice(productId, newPrice, depreciationCount) {
  await db.collection("products").doc(productId).update({
    currentPrice: newPrice,
    depreciationCount: depreciationCount,
    lastDepreciatedAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = { fetchDepreciatingProducts, updateProductPrice };
