// index.js
// Firebase Cloud Functions entry point

const functions = require("firebase-functions");
const { updatePricesScheduled, updateSingleProductPrice } = require("./jobs/priceUpdateJob");

// ─────────────────────────────────────────────────────────
//  SCHEDULED: Runs every day at midnight Kathmandu time
// ─────────────────────────────────────────────────────────
exports.scheduledPriceDepreciation = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("Asia/Kathmandu")
  .onRun(async () => {
    try {
      await updatePricesScheduled();
      console.log("✅ Daily price depreciation completed.");
    } catch (err) {
      console.error("❌ Scheduled depreciation failed:", err);
    }
  });

// ─────────────────────────────────────────────────────────
//  HTTP: Manually trigger full depreciation run (for testing)
//  POST https://<region>-<project>.cloudfunctions.net/manualDepreciation
// ─────────────────────────────────────────────────────────
exports.manualDepreciation = functions.https.onRequest(async (req, res) => {
  try {
    await updatePricesScheduled();
    res.status(200).json({ success: true, message: "Depreciation run complete" });
  } catch (err) {
    console.error("❌ Manual depreciation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────
//  HTTP: Depreciate a single product by ID (for testing)
//  POST https://.../depreciateSingleProduct?id=PRODUCT_ID
// ─────────────────────────────────────────────────────────
exports.depreciateSingleProduct = functions.https.onRequest(async (req, res) => {
  const productId = req.query.id || req.body.id;
  if (!productId) {
    return res.status(400).json({ error: "Missing product id" });
  }
  try {
    const newPrice = await updateSingleProductPrice(productId);
    res.status(200).json({ success: true, newPrice });
  } catch (err) {
    console.error("❌ Single product depreciation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});