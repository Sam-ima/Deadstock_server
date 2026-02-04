const { electronicsRule } = require("./rules/electronicsRule");
const { clothesRule } = require("./rules/clothesRule");
const { furnitureRule } = require("./rules/furnitureRule");
const { artRule } = require("./rules/artRule");

module.exports.calculateFinalPrice = (product, ageDays, season) => {
  let price;

  switch (product.category) {
    case "electronics":
      price = electronicsRule(product, ageDays);
      break;
    case "clothes":
      price = clothesRule(product, ageDays, season);
      break;
    case "furniture":
      price = furnitureRule(product, ageDays);
      break;
    case "art":
      price = artRule(product, ageDays);
      break;
    default:
      price = product.original_price;
  }

  return Math.max(price, product.floor_price);
};
