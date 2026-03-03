// jobs/priceUpdateJob.js
//
// SINGLE FLAG LOGIC:
//   isDepreciating: true  = product is active in pricing system
//   Category/subcategory  = decides UP (appreciation) or DOWN (depreciation) automatically
//   Floor price hit       = price stays at floor, isDepreciating stays TRUE
//   No isAppreciating field needed

const { fetchActiveProducts, updateProductPrice } = require("../services/productServices");
const { daysBetween, toDate }                     = require("../utils/dateUtils");
const { calculateFinalPrice }                     = require("../pricing/calculateFinalPrice");

async function updatePricesScheduled() {
  console.log("\n🔄 Starting price update job...");

  const products = await fetchActiveProducts();

  if (!products.length) {
    console.log("No active depreciating products found.");
    return;
  }

  console.log(`📦 Products to process: ${products.length}\n`);

  const today = new Date();
  let depUpdated = 0, appUpdated = 0, skipped = 0;

  for (const product of products) {
    try {
      // ── 1. Get manufacture date ──
      const manufactureDate = product.manufacture_date
        ? new Date(product.manufacture_date)
        : toDate(product.createdAt);

      if (!manufactureDate || isNaN(manufactureDate.getTime())) {
        console.warn(`⚠️  Skipping "${product.name}" — invalid manufacture_date`);
        skipped++;
        continue;
      }

      // ── 2. Age from manufacture date ──
      const ageDays = daysBetween(manufactureDate, today);

      // ── 3. Skip if already updated today ──
      const lastUpdate      = product.lastDepreciatedAt ? toDate(product.lastDepreciatedAt) : null;
      const daysSinceUpdate = lastUpdate ? daysBetween(lastUpdate, today) : 999;

      if (daysSinceUpdate < 1) {
        console.log(`⏭️  "${product.name}" — already updated today`);
        skipped++;
        continue;
      }

      // ── 4. Calculate new price (auto-detects appreciation from category) ──
      const { newPrice, isAppreciation, matchedOn, stage, tooNew } =
        calculateFinalPrice(product, ageDays);

      // ── 5. Too new — not reached startAfterDays yet ──
      if (tooNew) {
        console.log(`⏳ "${product.name}" — not old enough yet (age: ${ageDays}d) [${matchedOn}]`);
        skipped++;
        continue;
      }

      // ── 6. At floor price — price unchanged, skip update but keep isDepreciating:true ──
      const floorPrice = Number(product.floorPrice) || Number(product.basePrice) * 0.5;
      const atFloor    = !isAppreciation && newPrice <= floorPrice &&
                         Math.round(Number(product.currentPrice)) <= floorPrice;

      if (atFloor) {
        console.log(`🏁 "${product.name}" — at floor price Rs.${floorPrice}, no change (isDepreciating stays true)`);
        skipped++;
        continue;
      }

      // ── 7. Price unchanged — skip ──
      if (newPrice === Math.round(Number(product.currentPrice))) {
        console.log(`➡️  "${product.name}" — price unchanged at Rs.${newPrice}`);
        skipped++;
        continue;
      }

      // ── 8. Get count field ──
      const count = isAppreciation
        ? (product.appreciationCount || 0) + 1
        : (product.depreciationCount || 0) + 1;

      // ── 9. Save to Firestore ──
      await updateProductPrice(product.id, newPrice, isAppreciation, count);

      // ── 10. Log result ──
      const arrow     = isAppreciation ? "📈" : "📉";
      const stageInfo = stage
        ? (isAppreciation ? `+${stage.gainPercent}%` : `-${stage.dropPercent}%`)
        : "";

      console.log(
        `${arrow} "${product.name}"` +
        ` | [${matchedOn}]` +
        ` | Age: ${ageDays}d` +
        ` | Rs.${product.currentPrice} → Rs.${newPrice} (${stageInfo})`
      );

      isAppreciation ? appUpdated++ : depUpdated++;

    } catch (err) {
      console.error(`❌ Error "${product.name || product.id}": ${err.message}`);
    }
  }

  console.log(
    `\n📊 Done:` +
    `\n   📉 Deprecated  → ${depUpdated}` +
    `\n   📈 Appreciated → ${appUpdated}` +
    `\n   ⏭️  Skipped     → ${skipped}`
  );
}

module.exports = { updatePricesScheduled };