const { fetchDepreciatingProducts, updateProductPrice } = require("../services/productServices");
const { daysBetween } = require("../utils/dateUtils");
const { calculateFinalPrice } = require("../pricing/calculateFinalPrice");

async function updateSingleProductPrice(productId) {
  const products = await fetchDepreciatingProducts();
  const product = products.find(p => p.id === productId);
  if (!product) throw new Error("Product not found");

  const today = new Date();
  const manufactureDate = product.manufacture_date ? new Date(product.manufacture_date) : product.createdAt.toDate();
  const ageDays = daysBetween(manufactureDate, today);

  const lastUpdate = product.lastDepreciatedAt ? new Date(product.lastDepreciatedAt) : manufactureDate;
  const daysSinceUpdate = daysBetween(lastUpdate, today);

  if (daysSinceUpdate < 1) return product.currentPrice;

  const newPrice = calculateFinalPrice(product, ageDays);

  await updateProductPrice(product.id, Math.round(newPrice), (product.depreciationCount || 0) + daysSinceUpdate);

  console.log(`✅ ${product.name}: ${product.currentPrice} → ${Math.round(newPrice)}`);
  return newPrice;
}

async function updatePricesScheduled() {
  const products = await fetchDepreciatingProducts();
  const today = new Date();

  for (const product of products) {
    const manufactureDate = product.manufacture_date ? new Date(product.manufacture_date) : product.createdAt.toDate();
    const ageDays = daysBetween(manufactureDate, today);

    const lastUpdate = product.lastDepreciatedAt ? new Date(product.lastDepreciatedAt) : manufactureDate;
    const daysSinceUpdate = daysBetween(lastUpdate, today);

    if (daysSinceUpdate < 1) continue;

    const newPrice = calculateFinalPrice(product, ageDays);

    await updateProductPrice(product.id, Math.round(newPrice), (product.depreciationCount || 0) + daysSinceUpdate);

    console.log(`✅ ${product.name}: ${product.currentPrice} → ${Math.round(newPrice)}`);
  }

  console.log("Daily depreciation job finished");
}

module.exports = { updateSingleProductPrice, updatePricesScheduled };
