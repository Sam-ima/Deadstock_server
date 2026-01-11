// server/controllers/productPriceController.js

const ProductPriceEvolutionRules = require("../models/productPriceEvolutionModel");
const { fetchDepreciatingProducts, updateProductPrice } = require("../services/productService");
const { daysElapsed } = require("../utils/timeUtils");

/**
 * Determine applicable rule based on category name
 */
function getCategoryRule(categoryName) {
  return ProductPriceEvolutionRules.find(rule => rule.categoryPattern.test(categoryName));
}

/**
 * Calculate new price for a single product
 */
function normalizeDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate(); // Firestore Timestamp
  return new Date(value); // already a Date or string
}

function calculateNewPrice(product, rule) {
  const lastDate = product.lastDepreciatedAt
    ? normalizeDate(product.lastDepreciatedAt)
    : normalizeDate(product.createdAt);

  const today = new Date();
  const days = daysElapsed(lastDate, today); //Calculate how many full days passed:

  // Normalize rule (fallback to default)
  if (!rule || typeof rule.dailyRate !== "number") {
    rule = { dailyRate: -0.002, type: "UNKNOWN" };
  }

  // Normalize numbers
  const basePrice = Number(product.basePrice);
  const currentPrice = Number(product.currentPrice);
  const floorPrice = Number(product.floorPrice) || 0;
  const depCount = Number(product.depreciationCount) || 0;

  // If basePrice itself is broken, skip safely
  if (!Number.isFinite(basePrice)) {
    return { newPrice: product.currentPrice, count: depCount };
  }

  // If currentPrice is invalid, fall back to basePrice
  let price = Number.isFinite(currentPrice) ? currentPrice : basePrice;

  if (days <= 0) {
    return { newPrice: parseFloat(price.toFixed(2)), count: depCount };
  }

  // Apply daily rate
  price = price * Math.pow(1 + rule.dailyRate, days);

  // Seasonal adjustment
  if (rule.type === "SEASONAL") {
    let season = product.specifications?.season || "all";
    if (season !== "all" && rule.seasonalMultiplier) {
      const multiplier =
        season === "inSeason"
          ? rule.seasonalMultiplier.inSeason
          : rule.seasonalMultiplier.offSeason;

      if (Number.isFinite(multiplier)) {
        price = price * multiplier;
      }
    }
  }

  // Bulk adjustment
  if (product.moq > 1 && Number.isFinite(Number(product.bulkPrice))) {
    price = Number(product.bulkPrice);
  }

  // Final safety net
  if (!Number.isFinite(price)) {
    price = basePrice;
  }

  // Floor protection
  price = Math.max(price, floorPrice);

  const newDepCount = depCount + days;

  return {
    newPrice: parseFloat(price.toFixed(2)),
    count: Number.isFinite(newDepCount) ? newDepCount : 0,
  };
}

/**
 * Main function: process all products
 */
async function processPriceEvolution() {
  const products = await fetchDepreciatingProducts();

  for (const product of products) {
    const categoryName = product.categoryName || "unknown";
    const rule = getCategoryRule(categoryName);

    console.log("----");
    console.log("Product:", product.name);
    console.log("Category:", categoryName);
    console.log("Matched Rule:", rule);

    const { newPrice, count } = calculateNewPrice(product, rule);

    await updateProductPrice(product.id, newPrice, count);

    console.log(`Price: ${product.currentPrice} → ${newPrice}`);
  }

}

module.exports = { processPriceEvolution };
