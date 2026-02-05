module.exports.electronicsRule = (product, ageDays) => {
  const rate = -0.002; // 0.2% daily depreciation
  const price = Number(product.currentPrice || product.basePrice);
  return price * Math.pow(1 + rate, ageDays);
};
