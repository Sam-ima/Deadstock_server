// jobs/priceUpdateJob.js

const {
  fetchDepreciatingProducts,
  fetchAppreciatingProducts,
  updateProductPrice,
} = require("../services/productServices");
const { daysBetween, toDate } = require("../utils/dateUtils");
const { calculateFinalPrice } = require("../pricing/calculateFinalPrice");
const { DEPRECIATION_RULES } = require("../pricing/depreciationRules");

// Appreciation categories — if a product with isDepreciating:true
// belongs to one of these, it gets SKIPPED with a warning
const APPRECIATION_CATEGORIES = ["art", "arts", "antiques", "antique",
  "collectibles", "collectible", "paintings", "fine art", "arts & crafts"];

function isAppreciationCategory(categoryName) {
  const key = (categoryName || "").toLowerCase().trim();
  if (APPRECIATION_CATEGORIES.includes(key)) return true;
  const rule = DEPRECIATION_RULES[key];
  if (!rule) return false;
  const resolved = rule.ref ? DEPRECIATION_RULES[rule.ref] : rule;
  return resolved && resolved.appreciation === true;
}

/**
 * Shared logic for both depreciation and appreciation
 */
async function processProducts(products, isAppreciation) {
  const today = new Date();
  let updatedCount = 0;
  let skippedCount = 0;

  for (const product of products) {
    try {
      // ── Safety: skip appreciation categories in depreciation job ──
      if (!isAppreciation && isAppreciationCategory(product.categoryName)) {
        console.warn(
          `⚠️  SKIPPED ${product.name} (category: "${product.categoryName}") ` +
          `— this is an appreciation category. ` +
          `Fix in Firestore: isDepreciating→false, isAppreciating→true`
        );
        skippedCount++;
        continue;
      }

      // ── 1. Get manufacture date ──
      const manufactureDate = product.manufacture_date
        ? new Date(product.manufacture_date)
        : toDate(product.createdAt);

      if (!manufactureDate || isNaN(manufactureDate.getTime())) {
        console.warn(`⚠️  Skipping ${product.name} — invalid manufacture_date`);
        skippedCount++;
        continue;
      }

      // ── 2. Age in days ──
      const ageDays = daysBetween(manufactureDate, today);

      // ── 3. Skip if updated today already ──
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
      const newPrice    = calculateFinalPrice(product, ageDays);
      const roundedPrice = Math.round(newPrice);

      // ── 5. Skip if not old enough yet ──
      if (roundedPrice === Math.round(Number(product.basePrice))) {
        console.log(`⏳ ${product.name} — not old enough yet (age: ${ageDays}d)`);
        skippedCount++;
        continue;
      }

      // ── 6. Floor / ceiling check ──
      const basePrice  = Number(product.basePrice);
      const floorPrice = Number(product.floorPrice) || basePrice * 0.5;
      const ceiling    = basePrice * 2;

      const hitFloor   = !isAppreciation && roundedPrice <= floorPrice;
      const hitCeiling =  isAppreciation && roundedPrice >= ceiling;

      // ── 7. Count ──
      const newCount = isAppreciation
        ? (product.appreciationCount || 0) + 1
        : (product.depreciationCount || 0) + 1;

      // ── 8. Save to Firestore ──
      await updateProductPrice(
        product.id, roundedPrice, newCount,
        hitFloor, hitCeiling, isAppreciation
      );

      const arrow = isAppreciation ? "📈" : "📉";
      console.log(
        `${arrow} ${product.name} | Category: ${product.categoryName} | Age: ${ageDays}d | ` +
        `${product.currentPrice} → ${roundedPrice}` +
        (hitFloor   ? " | 🏁 Floor reached — stopped"   : "") +
        (hitCeiling ? " | 🏆 Ceiling reached — stopped" : "")
      );
      updatedCount++;

    } catch (err) {
      console.error(`❌ Error: ${product.name || product.id}:`, err.message);
    }
  }
  return { updatedCount, skippedCount };
}

/**
 * Main job — runs depreciation AND appreciation
 */
async function updatePricesScheduled() {
  console.log("\n🔄 Starting price update job...");

  const depProducts = await fetchDepreciatingProducts();
  console.log(`\n📉 Depreciating products found: ${depProducts.length}`);
  const depResult = await processProducts(depProducts, false);

  const appProducts = await fetchAppreciatingProducts();
  console.log(`\n📈 Appreciating products found: ${appProducts.length}`);
  const appResult = await processProducts(appProducts, true);

  console.log(
    `\n📊 Job complete:` +
    `\n   📉 Depreciation → ${depResult.updatedCount} updated, ${depResult.skippedCount} skipped` +
    `\n   📈 Appreciation → ${appResult.updatedCount} updated, ${appResult.skippedCount} skipped`
  );
}

module.exports = { updatePricesScheduled };