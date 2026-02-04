module.exports.furnitureRule = (product, ageDays) => {
  const yearly = Math.min((ageDays / 365) * 0.10, 0.40);
  return product.original_price * (1 - yearly);
};
