// server/models/ProductPriceEvolutionModel.js

/**
 * Model defining depreciation/price evolution rules
 * - categoryPattern: regex or string to match category names
 * - type: Determines how price evolves
 * - dailyRate: % change per day (negative for depreciation, positive for appreciation)
 * - seasonalMultiplier: optional, applied for seasonal categories
 */
const ProductPriceEvolutionRules = [
  {
    categoryPattern: /electronics/i,
    type: "DURABLE",
    dailyRate: -0.002, // 0.2% per day
  },
  {
    categoryPattern: /art|painting|collectible/i,
    type: "COLLECTIBLE",
    dailyRate: 0.001, // 0.1% appreciation
  },
  {
    categoryPattern: /clothing|fashion/i,
    type: "SEASONAL",
    dailyRate: -0.001, // slight daily depreciation
    seasonalMultiplier: { inSeason: 1.1, offSeason: 0.85 },
  },
  {
    categoryPattern: /books|media/i,
    type: "CONSUMABLE",
    dailyRate: -0.003, // 0.3% per day
  },
  {
    categoryPattern: /sports|fitness/i,
    type: "DURABLE",
    dailyRate: -0.002,
  },
  {
    categoryPattern: /.*/, // default for unknown categories
    type: "UNKNOWN",
    dailyRate: -0.002, // default depreciation
  },
];

module.exports = ProductPriceEvolutionRules;
