const functions = require("firebase-functions");
const { runDailyJob } = require("./jobs/dailyJob");

// Scheduled function — ONLY works on Firebase
const dailyPriceUpdate = functions.pubsub
  .schedule("every 24 hours")
  .onRun(runDailyJob);

module.exports = { dailyPriceUpdate };