module.exports.artRule = (product, ageDays) => {
  const appreciation = (ageDays / 365) * 0.05;
  return product.original_price * (1 + appreciation + product.demand_score * 0.10);
};
