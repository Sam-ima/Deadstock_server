const { db } = require("../firebaseAdmin");
const { daysBetween } = require("../utils/dateUtils");
const  {currentSeason}  = require("../utils/seasonUtils");
const { calculateFinalPrice } = require("../pricing/calculateFinalPrice");
const fs = require("fs");
const path = require("path");

/**
 * Fetch all products eligible for depreciation/appreciation
 */
async function fetchAllProducts() {
  const snapshot = await db.collection("products").get();
  const products = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    products.push({
      id: doc.id,
      name: data.name,
      categoryName: data.categoryName || "unknown",
      subcategoryName: data.subcategoryName || "unknown",
      basePrice: Number(data.basePrice),
      currentPrice: Number(data.currentPrice),
      floorPrice: Number(data.floorPrice),
      manufacture_date: data.manufacture_date,
      depreciationCount: data.depreciationCount || 0,
      seasonal: data.seasonal || null, // optional, for clothes
    });
  });
  return products;
}

/**
 * Simulate depreciation/appreciation for each product
 */
async function simulateDepreciation() {
  const products = await fetchAllProducts();
  const today = new Date();

  const historyData = [];

  for (const product of products) {
    const startDate = product.manufacture_date
      ? new Date(product.manufacture_date)
      : product.createdAt?.toDate() || new Date();

    const totalDays = daysBetween(startDate, today);
    let simulatedPrice = product.basePrice;

    const productHistory = [];

    for (let day = 1; day <= totalDays; day++) {
      const tempProduct = { ...product, currentPrice: simulatedPrice };
      const season = currentSeason();

      // Calculate price with your existing rules
      simulatedPrice = calculateFinalPrice(tempProduct, day, season);

      productHistory.push({
        day,
        price: simulatedPrice,
      });
    }

    // Update Firestore product with latest simulated price (optional)
    await db.collection("products").doc(product.id).update({
      currentPrice: Math.round(simulatedPrice),
      depreciationCount: totalDays,
      lastDepreciatedAt: today,
    });

    // Push history for CSV export
    productHistory.forEach((entry) => {
      historyData.push({
        productId: product.id,
        name: product.name,
        category: product.categoryName,
        subcategory: product.subcategoryName,
        day: entry.day,
        simulatedPrice: entry.price.toFixed(2),
      });
    });

    console.log(`Simulated: ${product.name} (${totalDays} days)`);
  }

  // Export to CSV
  const csvFile = path.join(__dirname, "depreciationHistory.csv");
  const headers = "productId,name,category,subcategory,day,simulatedPrice\n";
  const rows = historyData
    .map(
      (r) =>
        `${r.productId},${r.name},${r.category},${r.subcategory},${r.day},${r.simulatedPrice}`
    )
    .join("\n");

  fs.writeFileSync(csvFile, headers + rows);
  console.log(` Depreciation history exported: ${csvFile}`);
}

// Run the simulation
simulateDepreciation()
  .then(() => console.log("Simulation completed!"))
  .catch((err) => console.error(err));
