// pricing/rules/clothesRule.js
//
// FIX 1: Was using currentPrice as base — compounds errors on every run.
//         Now uses basePrice as the reference always.
// FIX 2: Season appreciation only applies if product.season matches current season.

module.exports.clothesRule = (product, ageDays, season) => {
  const basePrice = Number(product.basePrice);

  // Default: 0.15% depreciation per day
  let rate = -0.0015;

  // If product is tagged for a season AND we're in that season → slight appreciation
  if (season && product.season && product.season.toLowerCase() === season.toLowerCase()) {
    rate = 0.001; // 0.1% appreciation per day in-season (conservative)
  }

  const newPrice = basePrice * Math.pow(1 + rate, ageDays);
  return newPrice;
};