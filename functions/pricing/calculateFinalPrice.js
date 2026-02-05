const { electronicsRule } = require("./rules/electronicsRule");
const { clothesRule } = require("./rules/clothesRule");
const { furnitureRule } = require("./rules/furnitureRule");
const { artRule } = require("./rules/artRule");

function calculateFinalPrice(product, ageDays) {
  const basePrice = Number(product.basePrice);
  const currentPrice = Number(product.currentPrice) || basePrice;
  const floorPrice = Number(product.floorPrice) || basePrice * 0.5;
  let price = currentPrice;

  switch (product.categoryName) {
    case "electronics":
      price = electronicsRule(product, ageDays);
      break;
    case "clothes":
      price = clothesRule(product, ageDays);
      break;
    case "furniture":
      price = furnitureRule(product, ageDays);
      break;
    case "art":
      price = artRule(product, ageDays);
      break;
    default:
      price = currentPrice;
  }

  // Ensure price doesn't go below floorPrice
  return Math.max(price, floorPrice);
}

module.exports = { calculateFinalPrice };
