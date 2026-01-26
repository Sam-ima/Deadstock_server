const { runDailyJob } = require("./jobs/dailyJob");

// Run daily job locally
runDailyJob()
  .then(() => console.log("Daily job ran successfully"))
  .catch(console.error);