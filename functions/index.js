require("./firebaseAdmin"); // ensure Firebase is initialized first

const { processPriceEvolution } = require("./controllers/productPriceController");

async function run() {
  console.log("Starting daily price evolution process...");
  await processPriceEvolution();
  console.log("Finished price evolution process.");
}

run().catch(console.error);
