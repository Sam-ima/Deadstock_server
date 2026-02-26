// pricing/calculateFinalPrice.js
//
// FIX: ageDays was being passed correctly here but NOT passed from updatePricesScheduled.
//      That is fixed in priceUpdateJob.js. This file is now clean and correct.

const { electronicsRule } = require("./rules/electronicsRule");
const { clothesRule } = require("./rules/clothesRule");
const { furnitureRule } = require("./rules/furnitureRule");
const { artRule } = require("./rules/artRule");

/**
 * Calculate the new price for a product based on its category rules.
 *
 * @param {object} product - Full product object from Firestore
 * @param {number} ageDays - Total age of product in days from manufacture_date
 * @param {string} season  - Current season string e.g. "winter"
 * @returns {number} - New price (always >= floorPrice)
 */
module.exports.calculateFinalPrice = (product, ageDays, season) => {
  const basePrice = Number(product.basePrice);
  const floorPrice = Number(product.floorPrice) || basePrice * 0.5;

  // Guard: if ageDays is missing or invalid, keep current price
  if (typeof ageDays !== "number" || isNaN(ageDays) || ageDays < 0) {
    console.warn(`⚠️ Invalid ageDays for product ${product.id} — keeping currentPrice`);
    return Number(product.currentPrice) || basePrice;
  }

  let price = Number(product.currentPrice) || basePrice;

  switch ((product.categoryName || "").toLowerCase()) {
    case "electronics":
      price = electronicsRule(product, ageDays);
      break;
    case "clothes":
      price = clothesRule(product, ageDays, season);
      break;
    case "furniture":
      price = furnitureRule(product, ageDays);
      break;
    case "art":
      price = artRule(product, ageDays);
      break;
    default:
      // Unknown category — apply a simple 0.1% daily depreciation from basePrice
      price = basePrice * Math.pow(1 - 0.001, ageDays);
      break;
  }

  // Always enforce floor price
  return Math.max(price, floorPrice);
};