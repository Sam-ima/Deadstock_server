// services/productServices.js

const { db, admin } = require("../firebaseAdmin");

/**
 * Fetch all products eligible for depreciation
 * isDepreciating: true AND status: active
 */
async function fetchDepreciatingProducts() {
  const snapshot = await db
    .collection("products")
    .where("isDepreciating", "==", true)
    .where("status", "==", "active")
    .get();

  if (snapshot.empty) return [];
  return await resolveCategories(snapshot);
}

/**
 * Fetch all products eligible for appreciation
 * isAppreciating: true AND status: active
 */
async function fetchAppreciatingProducts() {
  const snapshot = await db
    .collection("products")
    .where("isAppreciating", "==", true)
    .where("status", "==", "active")
    .get();

  if (snapshot.empty) return [];
  return await resolveCategories(snapshot);
}

/**
 * Shared helper — resolves categoryName for all products in one batch
 */
async function resolveCategories(snapshot) {
  // Collect unique categoryIds
  const categoryIds = new Set();
  snapshot.docs.forEach((doc) => {
    const catId = doc.data().categoryId;
    if (catId) categoryIds.add(catId);
  });

  // Fetch all categories in ONE batch
  const categoryMap = {};
  if (categoryIds.size > 0) {
    const catSnaps = await Promise.all(
      Array.from(categoryIds).map((id) => db.collection("categories").doc(id).get())
    );
    catSnaps.forEach((snap) => {
      if (snap.exists) {
        categoryMap[snap.id] = (snap.data().name || "unknown").toLowerCase();
      }
    });
  }

  // Build product list with categoryName resolved
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      categoryName: categoryMap[data.categoryId] || "unknown",
    };
  });
}

/**
 * Update product price after depreciation or appreciation
 *
 * @param {string}  productId
 * @param {number}  newPrice
 * @param {number}  newCount          - new depreciationCount or appreciationCount
 * @param {boolean} stopDepreciating  - true if floor price hit
 * @param {boolean} stopAppreciating  - true if ceiling price hit
 * @param {boolean} isAppreciation    - true if this is an appreciation update
 */
async function updateProductPrice(
  productId,
  newPrice,
  newCount,
  stopDepreciating = false,
  stopAppreciating = false,
  isAppreciation = false
) {
  const updateData = {
    currentPrice: newPrice,
    lastDepreciatedAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  };

  if (isAppreciation) {
    updateData.appreciationCount = newCount;
    if (stopAppreciating) updateData.isAppreciating = false;
  } else {
    updateData.depreciationCount = newCount;
    if (stopDepreciating) updateData.isDepreciating = false;
  }

  await db.collection("products").doc(productId).update(updateData);
}

module.exports = {
  fetchDepreciatingProducts,
  fetchAppreciatingProducts,
  updateProductPrice,
};