// pricing/rules/artRule.js
//
// FIX: Art appreciates, but must have a ceiling (2× basePrice max) so it doesn't
//      grow infinitely. Still respects floorPrice from calculateFinalPrice.

module.exports.artRule = (product, ageDays) => {
  const rate = 0.001; // 0.1% appreciation per day
  const basePrice = Number(product.basePrice);
  const appreciated = basePrice * Math.pow(1 + rate, ageDays);

  // Cap at 2× basePrice
  const ceiling = basePrice * 2;
  return Math.min(appreciated, ceiling);
};