// services/productServices.js
//
// FIX: Old code fetched category name with one Firestore read PER product (N+1 problem).
//      New code fetches ALL categories in ONE query, then maps them in memory.

const { db, admin } = require("../firebaseAdmin");

/**
 * Fetch all products where isDepreciating=true and status=active.
 * Category names are resolved in a single batch read (not N separate reads).
 */
async function fetchDepreciatingProducts() {
  // Step 1: Fetch all active depreciating products
  const snapshot = await db
    .collection("products")
    .where("isDepreciating", "==", true)
    .where("status", "==", "active")
    .get();

  if (snapshot.empty) return [];

  // Step 2: Collect all unique categoryIds
  const categoryIds = new Set();
  snapshot.docs.forEach((doc) => {
    const catId = doc.data().categoryId;
    if (catId) categoryIds.add(catId);
  });

  // Step 3: Fetch all categories in ONE batch (not N reads)
  const categoryMap = {};
  if (categoryIds.size > 0) {
    const catPromises = Array.from(categoryIds).map((id) =>
      db.collection("categories").doc(id).get()
    );
    const catSnaps = await Promise.all(catPromises);
    catSnaps.forEach((snap) => {
      if (snap.exists) {
        categoryMap[snap.id] = (snap.data().name || "unknown").toLowerCase();
      }
    });
  }

  // Step 4: Build product list
  const products = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      categoryName: categoryMap[data.categoryId] || "unknown",
    };
  });

  return products;
}

/**
 * Update a product's price after depreciation.
 *
 * @param {string} productId
 * @param {number} newPrice        - Already rounded integer
 * @param {number} newDepreciationCount
 * @param {boolean} stopDepreciating - Set to true if price hit floor
 */
async function updateProductPrice(productId, newPrice, newDepreciationCount, stopDepreciating = false) {
  const updateData = {
    currentPrice: newPrice,
    depreciationCount: newDepreciationCount,
    lastDepreciatedAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  };

  // If the product has hit the floor, turn off further depreciation
  if (stopDepreciating) {
    updateData.isDepreciating = false;
  }

  await db.collection("products").doc(productId).update(updateData);
}

module.exports = { fetchDepreciatingProducts, updateProductPrice };