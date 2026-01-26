const {
  fetchDepreciatingProducts,
  updateProductPrice,
} = require("../services/productServices");
const { callMLModel } = require("../ml/mlClient");

// Pure function — callable locally or by scheduler
async function runDailyJob() {
  try {
    const products = await fetchDepreciatingProducts();
    console.log(`Found ${products.length} products to process`);

    for (const product of products) {
      // Skip if essential fields are missing
      if (!product.currentPrice || !product.basePrice) {
        console.warn(`Skipping product ${product.id} due to missing price`);
        continue;
      }

      const payload = {
        product_id: product.id,
        category: product.categoryId,
        subcategory: product.subcategoryId || null,
        brand: product.brand || null,
        original_price: product.basePrice,
        current_price: product.currentPrice,
        floor_price: product.floorPrice,
        age_days: product.age_days || 0,
        season: product.season || null,
      };

      const mlResult = await callMLModel(payload);

      // Validate ML output
      const MIN_PRICE = 1;
      const MAX_PRICE = product.basePrice * 2; // Adjust as needed
      const safePrice = Math.min(Math.max(mlResult.new_price, MIN_PRICE), MAX_PRICE);

      if (mlResult.new_price !== safePrice) {
        console.warn(
          `Product ${product.id} price adjusted from ${mlResult.new_price} to ${safePrice} to stay within safe range`
        );
      }

      await updateProductPrice(product.id, safePrice, mlResult.age_days);
      console.log(`Updated product ${product.id} to price ${safePrice}`);
    }

    console.log("✅ Daily price update completed");
  } catch (error) {
    console.error("Daily job failed:", error);
  }
}

module.exports = { runDailyJob };