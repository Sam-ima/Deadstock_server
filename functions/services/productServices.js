// services/productServices.js

const { db, admin } = require("../firebaseAdmin");

/**
 * Resolve categoryName + subcategoryName for a snapshot in ONE batch
 */
async function resolveCategories(snapshot) {
  const categoryIds    = new Set();
  const subcategoryIds = new Set();

  snapshot.docs.forEach((doc) => {
    const d = doc.data();
    if (d.categoryId)    categoryIds.add(d.categoryId);
    if (d.subcategoryId) subcategoryIds.add(d.subcategoryId);
  });

  const [catSnaps, subcatSnaps] = await Promise.all([
    Promise.all(Array.from(categoryIds).map(id    => db.collection("categories").doc(id).get())),
    Promise.all(Array.from(subcategoryIds).map(id => db.collection("subcategories").doc(id).get())),
  ]);

  const categoryMap    = {};
  const subcategoryMap = {};

  catSnaps.forEach(snap => {
    if (snap.exists) categoryMap[snap.id] = (snap.data().name || "").toLowerCase().trim();
  });
  subcatSnaps.forEach(snap => {
    if (snap.exists) subcategoryMap[snap.id] = (snap.data().name || "").toLowerCase().trim();
  });

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      categoryName:    categoryMap[data.categoryId]       || "unknown",
      subcategoryName: subcategoryMap[data.subcategoryId] || "",
    };
  });
}

/**
 * Fetch only products where isDepreciating: true AND status: active
 * This is the ONLY flag needed — appreciation is auto-detected from category
 */
async function fetchActiveProducts() {
  const snapshot = await db
    .collection("products")
    .where("isDepreciating", "==", true)
    .where("status", "==", "active")
    .get();

  if (snapshot.empty) return [];
  return await resolveCategories(snapshot);
}

/**
 * Update product price
 * - Never sets isDepreciating to false (stays true even at floor)
 * - Tracks depreciationCount or appreciationCount separately
 */
async function updateProductPrice(productId, newPrice, isAppreciation, count) {
  const updateData = {
    currentPrice:     newPrice,
    lastDepreciatedAt: admin.firestore.Timestamp.now(),
    updatedAt:         admin.firestore.Timestamp.now(),
  };

  if (isAppreciation) {
    updateData.appreciationCount = count;
  } else {
    updateData.depreciationCount = count;
  }

  // ✅ isDepreciating is NEVER set to false — product stays in system
  await db.collection("products").doc(productId).update(updateData);
}

module.exports = { fetchActiveProducts, updateProductPrice };