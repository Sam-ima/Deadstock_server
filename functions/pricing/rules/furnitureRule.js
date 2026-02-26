// pricing/rules/furnitureRule.js
//
// FIX: Was using currentPrice as base — compounding errors.
//      Now uses basePrice as the reference always.

module.exports.furnitureRule = (product, ageDays) => {
  const rate = -0.0008; // 0.08% depreciation per day (slow)
  const basePrice = Number(product.basePrice);
  return basePrice * Math.pow(1 + rate, ageDays);
};