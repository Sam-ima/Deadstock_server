// pricing/calculateFinalPrice.js

const { DEPRECIATION_RULES } = require("./depreciationRules");

/**
 * Resolves a rule — handles both direct rules and "ref" aliases
 * e.g. "fashion" → ref: "clothes" → returns the clothes rule
 */
function resolveRule(categoryKey) {
  const entry = DEPRECIATION_RULES[categoryKey];
  if (!entry) return DEPRECIATION_RULES.default;
  if (entry.ref) return DEPRECIATION_RULES[entry.ref] || DEPRECIATION_RULES.default;
  return entry;
}

/**
 * Calculate new price for a product based on its age and category rules.
 *
 * @param {object} product  - Full product object from Firestore
 * @param {number} ageDays  - Total days since manufacture_date
 * @returns {number}        - New price (always >= floorPrice)
 */
module.exports.calculateFinalPrice = (product, ageDays) => {
  const basePrice  = Number(product.basePrice);
  const floorPrice = Number(product.floorPrice) || basePrice * 0.5;

  // Guard: invalid ageDays → no change
  if (typeof ageDays !== "number" || isNaN(ageDays) || ageDays < 0) {
    console.warn(`⚠️ Invalid ageDays for ${product.name} — keeping basePrice`);
    return basePrice;
  }

  // Resolve rule for this category
  const categoryKey = (product.categoryName || "").toLowerCase().trim();
  const rule = resolveRule(categoryKey);

  // ── Not old enough to start depreciating yet ──
  if (ageDays < rule.startAfterDays) {
    return basePrice; // No change yet
  }

  // ── ART / ANTIQUES: Appreciation ──
  if (rule.appreciation) {
    const stage = [...rule.stages].reverse().find(s => ageDays >= s.afterDays);
    if (!stage) return basePrice;
    const newPrice = basePrice + (basePrice * stage.gainPercent / 100);
    return Math.min(newPrice, basePrice * 2); // Cap at 2× basePrice
  }

  // ── ALL OTHER CATEGORIES: Stage-based depreciation ──
  const stage = [...rule.stages].reverse().find(s => ageDays >= s.afterDays);
  if (!stage) return basePrice;

  const newPrice = basePrice - (basePrice * stage.dropPercent / 100);
  return Math.max(newPrice, floorPrice); // Never below floor
};