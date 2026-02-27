// jobs/priceUpdateJob.js

const {
  fetchDepreciatingProducts,
  fetchAppreciatingProducts,
  updateProductPrice,
} = require("../services/productServices");
const { daysBetween, toDate } = require("../utils/dateUtils");
const { calculateFinalPrice } = require("../pricing/calculateFinalPrice");

/**
 * Process a list of products — shared logic for both depreciation and appreciation
 */
async function processProducts(products, isAppreciation) {
  const today = new Date();
  let updatedCount = 0;
  let skippedCount = 0;

  for (const product of products) {
    try {
      // ── 1. Get manufacture date ──
      const manufactureDate = product.manufacture_date
        ? new Date(product.manufacture_date)
        : toDate(product.createdAt);

      if (!manufactureDate || isNaN(manufactureDate.getTime())) {
        console.warn(`⚠️  Skipping ${product.name} — invalid manufacture_date`);
        skippedCount++;
        continue;
      }

      // ── 2. Calculate age in days ──
      const ageDays = daysBetween(manufactureDate, today);

      // ── 3. Skip if already updated today ──
      const lastUpdate = product.lastDepreciatedAt
        ? toDate(product.lastDepreciatedAt)
        : null;
      const daysSinceUpdate = lastUpdate ? daysBetween(lastUpdate, today) : 999;

      if (daysSinceUpdate < 1) {
        console.log(`⏭️  Skipping ${product.name} — already updated today`);
        skippedCount++;
        continue;
      }

      // ── 4. Calculate new price ──
      const newPrice = calculateFinalPrice(product, ageDays);
      const roundedPrice = Math.round(newPrice);

      // ── 5. Skip if price hasn't changed yet (too new) ──
      if (roundedPrice === Math.round(Number(product.basePrice))) {
        console.log(`⏳ ${product.name} — not old enough yet (age: ${ageDays}d)`);
        skippedCount++;
        continue;
      }

      // ── 6. Check floor / ceiling ──
      const basePrice  = Number(product.basePrice);
      const floorPrice = Number(product.floorPrice) || basePrice * 0.5;
      const ceiling    = basePrice * 2;

      const hitFloor   = !isAppreciation && roundedPrice <= floorPrice;
      const hitCeiling =  isAppreciation && roundedPrice >= ceiling;

      // ── 7. Get count field ──
      const countField = isAppreciation
        ? (product.appreciationCount || 0) + 1
        : (product.depreciationCount || 0) + 1;

      // ── 8. Update Firestore ──
      await updateProductPrice(
        product.id,
        roundedPrice,
        countField,
        hitFloor,
        hitCeiling,
        isAppreciation
      );

      const arrow = isAppreciation ? "📈" : "📉";
      console.log(
        `${arrow} ${product.name} | Category: ${product.categoryName} | Age: ${ageDays}d | ` +
        `${product.currentPrice} → ${roundedPrice}` +
        (hitFloor    ? " | 🏁 Floor reached — stopped"   : "") +
        (hitCeiling  ? " | 🏆 Ceiling reached — stopped" : "")
      );

      updatedCount++;
    } catch (err) {
      console.error(`❌ Error processing ${product.name || product.id}:`, err.message);
    }
  }

  return { updatedCount, skippedCount };
}

/**
 * Main job — runs depreciation AND appreciation for all eligible products
 * Called on server startup and every 24 hours
 */
async function updatePricesScheduled() {
  console.log("\n🔄 Starting price update job...");

  // ── Run DEPRECIATION (isDepreciating: true) ──
  const depProducts = await fetchDepreciatingProducts();
  console.log(`\n📉 Depreciating products found: ${depProducts.length}`);
  const depResult = await processProducts(depProducts, false);

  // ── Run APPRECIATION (isAppreciating: true) ──
  const appProducts = await fetchAppreciatingProducts();
  console.log(`\n📈 Appreciating products found: ${appProducts.length}`);
  const appResult = await processProducts(appProducts, true);

  console.log(
    `\n📊 Job complete:` +
    `\n   Depreciation → ${depResult.updatedCount} updated, ${depResult.skippedCount} skipped` +
    `\n   Appreciation → ${appResult.updatedCount} updated, ${appResult.skippedCount} skipped`
  );
}

module.exports = { updatePricesScheduled };