// pricing/calculateFinalPrice.js

const { DEPRECIATION_RULES } = require("./depreciationRules");

/**
 * Resolve a rule key — handles "ref" aliases
 */
function resolveRule(key) {
  if (!key) return null;
  const entry = DEPRECIATION_RULES[key];
  if (!entry) return null;
  if (entry.ref) return DEPRECIATION_RULES[entry.ref] || null;
  return entry;
}

/**
 * Find rule — subcategory first, then category, then default
 * Also returns whether this rule is appreciation or depreciation
 */
function findRule(product) {
  const subcat = (product.subcategoryName || "").toLowerCase().trim();
  const cat    = (product.categoryName    || "").toLowerCase().trim();

  // 1. Try subcategory first (most specific)
  if (subcat) {
    const rule = resolveRule(subcat);
    if (rule) return { rule, matchedOn: `subcategory "${subcat}"` };
  }

  // 2. Try category
  if (cat) {
    const rule = resolveRule(cat);
    if (rule) return { rule, matchedOn: `category "${cat}"` };
  }

  // 3. Default
  return { rule: DEPRECIATION_RULES.default, matchedOn: "default" };
}

/**
 * Calculate new price for a product
 *
 * @param {object} product - must have categoryName, subcategoryName, basePrice, floorPrice
 * @param {number} ageDays - days since manufacture_date
 * @returns {{ newPrice, isAppreciation, matchedOn, stage }}
 */
module.exports.calculateFinalPrice = (product, ageDays) => {
  const basePrice  = Number(product.basePrice);
  const floorPrice = Number(product.floorPrice) || basePrice * 0.5;
  const ceiling    = basePrice * 2;

  // Guard
  if (typeof ageDays !== "number" || isNaN(ageDays) || ageDays < 0) {
    return { newPrice: basePrice, isAppreciation: false, matchedOn: "guard", stage: null };
  }

  const { rule, matchedOn } = findRule(product);
  const isAppreciation = rule.appreciation === true;

  // Not old enough yet — return basePrice unchanged
  if (ageDays < rule.startAfterDays) {
    return { newPrice: basePrice, isAppreciation, matchedOn, stage: null, tooNew: true };
  }

  // Find current stage (last stage whose afterDays <= ageDays)
  const stage = [...rule.stages].reverse().find(s => ageDays >= s.afterDays);
  if (!stage) {
    return { newPrice: basePrice, isAppreciation, matchedOn, stage: null };
  }

  let newPrice;
  if (isAppreciation) {
    newPrice = basePrice + (basePrice * stage.gainPercent / 100);
    newPrice = Math.min(newPrice, ceiling); // Cap at 2× basePrice
  } else {
    newPrice = basePrice - (basePrice * stage.dropPercent / 100);
    newPrice = Math.max(newPrice, floorPrice); // Never below floor
  }

  return { newPrice: Math.round(newPrice), isAppreciation, matchedOn, stage };
};