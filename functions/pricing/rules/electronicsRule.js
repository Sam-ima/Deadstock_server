// pricing/rules/electronicsRule.js
//
// FIX: Old code did → currentPrice * Math.pow(1 + rate, ageDays)
//      This compounded the TOTAL age every time it ran, crashing price instantly.
//      Correct approach: apply rate only for the NEW days since last update (daysSinceUpdate).
//      basePrice is the reference — we calculate from basePrice × (decay for total age).

module.exports.electronicsRule = (product, ageDays) => {
  const rate = -0.002; // 0.2% depreciation per day

  // ✅ Always calculate from basePrice so we don't compound errors over time
  const basePrice = Number(product.basePrice);
  const newPrice = basePrice * Math.pow(1 + rate, ageDays);

  return newPrice;
};