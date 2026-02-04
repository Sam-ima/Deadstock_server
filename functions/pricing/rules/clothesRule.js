module.exports.clothesRule = (product, ageDays, season) => {
  let depreciation = 0.40;

  if (ageDays > 120) depreciation += 0.15;
  if (product.season && product.season !== season) depreciation += 0.20;

  if (product.subcategory === "seasonal") depreciation += 0.10;

  depreciation -= product.trend_score * 0.10;

  return product.original_price * (1 - depreciation);
};
