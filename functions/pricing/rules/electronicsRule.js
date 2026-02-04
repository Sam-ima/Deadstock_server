module.exports.electronicsRule = (product, ageDays) => {
  let depreciation = 0;

  if (product.subcategory === "mobile") {
    depreciation = ageDays <= 90 ? 0.30 : 0.50;
  } else if (product.subcategory === "refrigerator") {
    depreciation = ageDays <= 180 ? 0.20 : 0.35;
  } else {
    depreciation = 0.40;
  }

  depreciation -= product.demand_score * 0.10;

  return product.original_price * (1 - depreciation);
};
