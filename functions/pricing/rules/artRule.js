// pricing/rules/artRule.js

module.exports.artRule = (product, ageDays) => {
  const rate = 0.001; // slow appreciation 0.1% daily
  const price = Number(product.currentPrice || product.basePrice);
  return price * Math.pow(1 + rate, ageDays);
};
