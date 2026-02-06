// pricing/rules/furnitureRule.js

module.exports.furnitureRule = (product, ageDays) => {
  const rate = -0.0008; // slow depreciation 0.08% daily
  const price = Number(product.currentPrice || product.basePrice);
  return price * Math.pow(1 + rate, ageDays);
};
