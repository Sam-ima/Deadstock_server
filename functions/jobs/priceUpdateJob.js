const functions = require("firebase-functions");
const { db } = require("../firebaseAdmin");
const { daysBetween } = require("../utils/dateUtils");
const { currentSeason } = require("../utils/seasonUtils");
const { UPDATE_INTERVALS } = require("../pricing/updateIntervals");
const { calculateFinalPrice } = require("../pricing/calculateFinalPrice");

exports.updatePricesScheduled = functions.pubsub
  .schedule("every day 00:00")
  .timeZone("Asia/Kathmandu")
  .onRun(async () => {
    const snapshot = await db.collection("products").get();
    const today = new Date();
    const season = currentSeason();

    for (const doc of snapshot.docs) {
      const product = doc.data();

      const categoryRules = UPDATE_INTERVALS[product.category];
      const interval =
        categoryRules?.[product.subcategory] ||
        categoryRules?.default ||
        30;

      const lastUpdate = product.last_price_update?.toDate?.() || product.created_at.toDate();
      const daysSinceUpdate = daysBetween(lastUpdate, today);

      if (daysSinceUpdate >= interval) {
        const ageDays = daysBetween(product.created_at.toDate(), today);
        const newPrice = calculateFinalPrice(product, ageDays, season);

        await doc.ref.update({
          current_price: Math.round(newPrice),
          last_price_update: today
        });
      }
    }

    return null;
  });
