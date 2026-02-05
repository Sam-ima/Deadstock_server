const functions = require("firebase-functions");
const { updatePricesScheduled } = require("./jobs/priceUpdateJob");

// Scheduled daily at midnight Kathmandu time
exports.updatePricesScheduled = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("Asia/Kathmandu")
  .onRun(async () => {
    try {
      await updatePricesScheduled();
      console.log("✅ Daily price depreciation completed.");
    } catch (err) {
      console.error("❌ Error in scheduled price update:", err);
    }
  });

// Optional HTTP trigger for instant test
exports.testPriceDepreciation = functions.https.onRequest(async (req, res) => {
  try {
    await updatePricesScheduled();
    res.send("Price depreciation ran successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error running price depreciation.");
  }
});
