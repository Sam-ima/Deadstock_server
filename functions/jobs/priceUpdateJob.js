// jobs/priceUpdateJob.js
//
// FIXES APPLIED:
// 1. ageDays was not passed to calculateFinalPrice in updatePricesScheduled — FIXED
// 2. lastDepreciatedAt from Firestore is a Timestamp, not a Date — use toDate() — FIXED
// 3. depreciationCount incremented by 1 (not by daysSinceUpdate) consistently — FIXED
// 4. stopDepreciating flag passed to updateProductPrice when floor is hit — FIXED

const { fetchDepreciatingProducts, updateProductPrice } = require("../services/productServices");
const { daysBetween, toDate } = require("../utils/dateUtils");
const { calculateFinalPrice } = require("../pricing/calculateFinalPrice");
const { currentSeason } = require("../utils/seasonUtils");

/**
 * Run depreciation for ALL eligible products.
 * Called by the scheduled Cloud Function every day.
 */
async function updatePricesScheduled() {
  const products = await fetchDepreciatingProducts();

  if (!products.length) {
    console.log("No depreciating products found.");
    return;
  }

  const today = new Date();
  const season = currentSeason();
  let updatedCount = 0;
  let skippedCount = 0;

  for (const product of products) {
    try {
      // ── 1. Parse manufacture_date (string "YYYY-MM-DD") ──
      const manufactureDate = product.manufacture_date
        ? new Date(product.manufacture_date)
        : toDate(product.createdAt);

      if (!manufactureDate || isNaN(manufactureDate.getTime())) {
        console.warn(`⚠️  Skipping ${product.name} — invalid manufacture_date`);
        skippedCount++;
        continue;
      }

      // ── 2. Total age of product from manufacture date ──
      const ageDays = daysBetween(manufactureDate, today);

      // ── 3. FIX: Convert Firestore Timestamp to Date using toDate() ──
      //    Old: new Date(product.lastDepreciatedAt)  → Invalid Date
      //    New: toDate(product.lastDepreciatedAt)    → correct JS Date
      const lastUpdate = product.lastDepreciatedAt
        ? toDate(product.lastDepreciatedAt)
        : manufactureDate;

      const daysSinceUpdate = daysBetween(lastUpdate, today);

      // Skip if updated less than 1 day ago
      if (daysSinceUpdate < 1) {
        console.log(`⏭️  Skipping ${product.name} — updated recently`);
        skippedCount++;
        continue;
      }

      // ── 4. FIX: Pass ageDays to calculateFinalPrice ──
      //    Old: calculateFinalPrice(product)         → ageDays was undefined!
      //    New: calculateFinalPrice(product, ageDays, season)
      const newPrice = calculateFinalPrice(product, ageDays, season);
      const roundedPrice = Math.round(newPrice);

      // ── 5. Check if price hit floor ──
      const floorPrice = Number(product.floorPrice) || Number(product.basePrice) * 0.5;
      const hitFloor = roundedPrice <= floorPrice;

      // ── 6. FIX: depreciationCount increments by 1 each run (consistent) ──
      const newDepreciationCount = (product.depreciationCount || 0) + 1;

      // ── 7. Update Firestore ──
      await updateProductPrice(
        product.id,
        roundedPrice,
        newDepreciationCount,
        hitFloor // stops depreciation if floor is reached
      );

      console.log(
        `✅ ${product.name} | Age: ${ageDays}d | Season: ${season} | ` +
        `${product.currentPrice} → ${roundedPrice} | Floor: ${floorPrice}` +
        (hitFloor ? " | 🏁 Floor reached — stopped" : "")
      );

      updatedCount++;
    } catch (err) {
      console.error(`❌ Error processing ${product.name || product.id}:`, err.message);
    }
  }

  console.log(`\n📊 Done: ${updatedCount} updated, ${skippedCount} skipped.`);
}

/**
 * Run depreciation for a SINGLE product by ID.
 * Useful for testing or admin triggers.
 */
async function updateSingleProductPrice(productId) {
  const products = await fetchDepreciatingProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) throw new Error(`Product not found: ${productId}`);

  const today = new Date();
  const season = currentSeason();

  const manufactureDate = product.manufacture_date
    ? new Date(product.manufacture_date)
    : toDate(product.createdAt);

  if (!manufactureDate || isNaN(manufactureDate.getTime())) {
    throw new Error(`Invalid manufacture_date for product: ${productId}`);
  }

  const ageDays = daysBetween(manufactureDate, today);

  const lastUpdate = product.lastDepreciatedAt
    ? toDate(product.lastDepreciatedAt)
    : manufactureDate;

  const daysSinceUpdate = daysBetween(lastUpdate, today);

  if (daysSinceUpdate < 1) {
    console.log(`⏭️  No update needed for ${product.name} — updated recently`);
    return product.currentPrice;
  }

  const newPrice = calculateFinalPrice(product, ageDays, season);
  const roundedPrice = Math.round(newPrice);
  const floorPrice = Number(product.floorPrice) || Number(product.basePrice) * 0.5;
  const hitFloor = roundedPrice <= floorPrice;
  const newDepreciationCount = (product.depreciationCount || 0) + 1;

  await updateProductPrice(product.id, roundedPrice, newDepreciationCount, hitFloor);

  console.log(`✅ ${product.name}: ${product.currentPrice} → ${roundedPrice}`);
  return roundedPrice;
}

module.exports = { updatePricesScheduled, updateSingleProductPrice };