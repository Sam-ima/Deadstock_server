const { updatePricesScheduled } = require("./jobs/priceUpdateJob");

(async () => {
  try {
    console.log("Starting price depreciation test...");
    await updatePricesScheduled();
    console.log("Price depreciation completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error during price depreciation:", err);
    process.exit(1);
  }
})();
