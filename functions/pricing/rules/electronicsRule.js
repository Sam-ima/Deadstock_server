// pricing/rules/electronicsRule.js

module.exports.electronicsRule = (product, ageDays) => {
  const rate = -0.002; // daily depreciation 0.2%
  const price = Number(product.currentPrice || product.basePrice);
  return price * Math.pow(1 + rate, ageDays);
};
