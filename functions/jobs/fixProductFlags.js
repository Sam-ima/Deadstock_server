// jobs/fixProductFlags.js
//
// AUTO-FIX on startup:
//   - Any product with status:active should have isDepreciating:true
//   - Removes isAppreciating field (no longer needed)
//   - Resets wrongly depreciated art/antique prices back to basePrice

const { db, admin }          = require("../firebaseAdmin");
const { DEPRECIATION_RULES } = require("../pricing/depreciationRules");

function resolveRule(key) {
  if (!key) return null;
  const entry = DEPRECIATION_RULES[key];
  if (!entry) return null;
  if (entry.ref) return DEPRECIATION_RULES[entry.ref] || null;
  return entry;
}

function isAppreciationCategory(subcategoryName, categoryName) {
  const subcat = (subcategoryName || "").toLowerCase().trim();
  const cat    = (categoryName    || "").toLowerCase().trim();
  if (subcat) { const r = resolveRule(subcat); if (r) return r.appreciation === true; }
  if (cat)    { const r = resolveRule(cat);    if (r) return r.appreciation === true; }
  return false;
}

async function autoFixProductFlags() {
  console.log("🔧 Auto-fixing product flags...");

  const snapshot = await db
    .collection("products")
    .where("status", "==", "active")
    .get();

  if (snapshot.empty) { console.log("No active products.\n"); return; }

  // Fetch all categories + subcategories in one batch
  const categoryIds = new Set(), subcategoryIds = new Set();
  snapshot.docs.forEach(doc => {
    const d = doc.data();
    if (d.categoryId)    categoryIds.add(d.categoryId);
    if (d.subcategoryId) subcategoryIds.add(d.subcategoryId);
  });

  const [catSnaps, subcatSnaps] = await Promise.all([
    Promise.all(Array.from(categoryIds).map(id    => db.collection("categories").doc(id).get())),
    Promise.all(Array.from(subcategoryIds).map(id => db.collection("subcategories").doc(id).get())),
  ]);

  const categoryMap = {}, subcategoryMap = {};
  catSnaps.forEach(s   => { if (s.exists) categoryMap[s.id]    = (s.data().name || "").toLowerCase().trim(); });
  subcatSnaps.forEach(s => { if (s.exists) subcategoryMap[s.id] = (s.data().name || "").toLowerCase().trim(); });

  const batch = db.batch();
  let fixed = 0, ok = 0;

  for (const doc of snapshot.docs) {
    const p             = doc.data();
    const categoryName    = categoryMap[p.categoryId]       || "unknown";
    const subcategoryName = subcategoryMap[p.subcategoryId] || "";
    const appreciation    = isAppreciationCategory(subcategoryName, categoryName);

    const updateData = {};
    let needsFix = false;

    // ── Rule 1: All active products must have isDepreciating:true ──
    if (p.isDepreciating !== true) {
      updateData.isDepreciating = true;
      needsFix = true;
    }

    // ── Rule 2: Remove isAppreciating field (no longer needed) ──
    if (p.isAppreciating !== undefined) {
      updateData.isAppreciating = admin.firestore.FieldValue.delete();
      needsFix = true;
    }

    // ── Rule 3: If appreciation category but price was wrongly decreased ──
    if (appreciation) {
      const currentPrice = Number(p.currentPrice);
      const basePrice    = Number(p.basePrice);
      if (currentPrice < basePrice) {
        updateData.currentPrice     = basePrice;
        updateData.depreciationCount = 0;
        needsFix = true;
        console.log(
          `🔄 FIXED "${p.name}" [${subcategoryName || categoryName}]` +
          ` → appreciation category, price reset: ${currentPrice} → ${basePrice}`
        );
      }
    }

    if (needsFix) {
      updateData.updatedAt = admin.firestore.Timestamp.now();
      batch.update(doc.ref, updateData);
      fixed++;
      if (!updateData.currentPrice) {
        console.log(`🔄 FIXED "${p.name}" → isDepreciating:true`);
      }
    } else {
      ok++;
    }
  }

  if (fixed > 0) await batch.commit();
  console.log(`✅ Auto-fix: ${fixed} fixed, ${ok} already correct\n`);
}

module.exports = { autoFixProductFlags };