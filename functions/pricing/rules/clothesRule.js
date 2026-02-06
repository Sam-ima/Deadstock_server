// pricing/rules/clothesRule.js

module.exports.clothesRule = (product, ageDays, season) => {
  let rate = -0.0015; // 0.15% daily depreciation
  if (season && product.season === season) {
    rate = 0.002; // appreciation during in-season
  }
  const price = Number(product.currentPrice || product.basePrice);
  return price * Math.pow(1 + rate, ageDays);
};
