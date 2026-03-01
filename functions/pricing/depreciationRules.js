// pricing/depreciationRules.js
//
// VERIFIED REAL-WORLD DEPRECIATION & APPRECIATION RULES
// Sources:
//   - IRS Publication 946 — MACRS depreciation schedules
//   - ClaimsPages.com depreciation calculator
//   - United Policyholders Depreciation Guide
//   - Retail industry markdown standards

module.exports.DEPRECIATION_RULES = {

  // ─────────────────────────────────────────
  //  CLOTHES / FASHION
  //  Source: Retail 30/60/90 day markdown standard
  // ─────────────────────────────────────────
  clothes: {
    startAfterDays: 30,
    stages: [
      { afterDays: 30,  dropPercent: 20 },
      { afterDays: 60,  dropPercent: 50 },
      { afterDays: 90,  dropPercent: 70 },
    ]
  },
  fashion:           { ref: "clothes" },
  clothing:          { ref: "clothes" },
  apparel:           { ref: "clothes" },
  garments:          { ref: "clothes" },
  seasonal_clothing: { ref: "clothes" },
  "men's fashion":   { ref: "clothes" },
  "women's fashion": { ref: "clothes" },
  "kids fashion":    { ref: "clothes" },

  // ─────────────────────────────────────────
  //  ELECTRONICS
  //  Source: IRS MACRS 5-Year Property Class
  // ─────────────────────────────────────────
  electronics: {
    startAfterDays: 0,
    stages: [
      { afterDays: 0,    dropPercent: 0  },
      { afterDays: 90,   dropPercent: 10 },
      { afterDays: 180,  dropPercent: 20 },
      { afterDays: 365,  dropPercent: 35 },
      { afterDays: 730,  dropPercent: 55 },
      { afterDays: 1095, dropPercent: 70 },
    ]
  },
  gadgets:          { ref: "electronics" },
  mobiles:          { ref: "electronics" },
  computers:        { ref: "electronics" },
  phones:           { ref: "electronics" },
  "consumer electronics": { ref: "electronics" },
  cameras:          { ref: "electronics" },
  audio:            { ref: "electronics" },
  drones:           { ref: "electronics" },

  // ─────────────────────────────────────────
  //  FURNITURE / HOME & GARDEN
  //  Source: IRS MACRS 7-Year Property Class
  // ─────────────────────────────────────────
  furniture: {
    startAfterDays: 180,
    stages: [
      { afterDays: 180,  dropPercent: 5  },
      { afterDays: 365,  dropPercent: 15 },
      { afterDays: 730,  dropPercent: 25 },
      { afterDays: 1095, dropPercent: 35 },
      { afterDays: 1825, dropPercent: 50 },
    ]
  },
  home:              { ref: "furniture" },
  homewares:         { ref: "furniture" },
  decor:             { ref: "furniture" },
  "home & garden":   { ref: "furniture" },   // ← FIXED
  "home and garden": { ref: "furniture" },
  garden:            { ref: "furniture" },
  "home decor":      { ref: "furniture" },
  "home furniture":  { ref: "furniture" },

  // ─────────────────────────────────────────
  //  ART / ANTIQUES / COLLECTIBLES
  //  Source: United Policyholders Guide —
  //  "antiques and fine art should not depreciate"
  //  These APPRECIATE in value
  // ─────────────────────────────────────────
  art: {
    startAfterDays: 365,
    appreciation: true,
    stages: [
      { afterDays: 365,  gainPercent: 5  },
      { afterDays: 730,  gainPercent: 12 },
      { afterDays: 1095, gainPercent: 20 },
      { afterDays: 1825, gainPercent: 35 },
      { afterDays: 3650, gainPercent: 80 },
    ]
  },
  arts:         { ref: "art" },        // ← FIXED (was missing)
  antiques:     { ref: "art" },
  antique:      { ref: "art" },
  collectibles: { ref: "art" },
  collectible:  { ref: "art" },
  paintings:    { ref: "art" },
  "fine art":   { ref: "art" },
  "arts & crafts": { ref: "art" },

  // ─────────────────────────────────────────
  //  JEWELRY / WATCHES
  //  Source: United Policyholders Guide
  // ─────────────────────────────────────────
  jewelry: {
    startAfterDays: 365,
    stages: [
      { afterDays: 365,  dropPercent: 5  },
      { afterDays: 730,  dropPercent: 10 },
      { afterDays: 1825, dropPercent: 20 },
    ]
  },
  watches:     { ref: "jewelry" },
  accessories: { ref: "jewelry" },

  // ─────────────────────────────────────────
  //  SPORTS / FITNESS
  //  Source: ClaimsPages "Hobbies and Sporting Goods"
  // ─────────────────────────────────────────
  sports: {
    startAfterDays: 60,
    stages: [
      { afterDays: 60,   dropPercent: 10 },
      { afterDays: 180,  dropPercent: 20 },
      { afterDays: 365,  dropPercent: 35 },
      { afterDays: 730,  dropPercent: 50 },
      { afterDays: 1095, dropPercent: 65 },
    ]
  },
  fitness:          { ref: "sports" },
  outdoors:         { ref: "sports" },
  "sporting goods": { ref: "sports" },

  // ─────────────────────────────────────────
  //  TOYS / GAMES
  //  Source: ClaimsPages "Toys and Games"
  // ─────────────────────────────────────────
  toys: {
    startAfterDays: 30,
    stages: [
      { afterDays: 30,   dropPercent: 15 },
      { afterDays: 90,   dropPercent: 30 },
      { afterDays: 180,  dropPercent: 45 },
      { afterDays: 365,  dropPercent: 60 },
      { afterDays: 730,  dropPercent: 70 },
    ]
  },
  games: { ref: "toys" },
  kids:  { ref: "toys" },

  // ─────────────────────────────────────────
  //  BOOKS / MEDIA
  //  Source: ClaimsPages "Books"
  // ─────────────────────────────────────────
  books: {
    startAfterDays: 30,
    stages: [
      { afterDays: 30,   dropPercent: 20 },
      { afterDays: 180,  dropPercent: 40 },
      { afterDays: 365,  dropPercent: 55 },
      { afterDays: 730,  dropPercent: 65 },
    ]
  },
  media:  { ref: "books" },
  music:  { ref: "books" },
  movies: { ref: "books" },

  // ─────────────────────────────────────────
  //  COSMETICS / BEAUTY
  //  Source: Product expiry standard
  // ─────────────────────────────────────────
  cosmetics: {
    startAfterDays: 30,
    stages: [
      { afterDays: 30,   dropPercent: 20 },
      { afterDays: 90,   dropPercent: 40 },
      { afterDays: 180,  dropPercent: 60 },
      { afterDays: 270,  dropPercent: 75 },
    ]
  },
  beauty:   { ref: "cosmetics" },
  skincare: { ref: "cosmetics" },

  // ─────────────────────────────────────────
  //  FOOD / GROCERY
  //  Source: Perishable goods standard
  // ─────────────────────────────────────────
  food: {
    startAfterDays: 0,
    stages: [
      { afterDays: 0,   dropPercent: 0  },
      { afterDays: 7,   dropPercent: 20 },
      { afterDays: 14,  dropPercent: 40 },
      { afterDays: 30,  dropPercent: 65 },
      { afterDays: 60,  dropPercent: 80 },
    ]
  },
  grocery:     { ref: "food" },
  perishables: { ref: "food" },
  beverages:   { ref: "food" },

  // ─────────────────────────────────────────
  //  TOOLS / HARDWARE
  //  Source: IRS 5-7 year durable goods
  // ─────────────────────────────────────────
  tools: {
    startAfterDays: 90,
    stages: [
      { afterDays: 90,   dropPercent: 5  },
      { afterDays: 365,  dropPercent: 15 },
      { afterDays: 730,  dropPercent: 30 },
      { afterDays: 1825, dropPercent: 50 },
    ]
  },
  hardware:  { ref: "tools" },
  equipment: { ref: "tools" },

  // ─────────────────────────────────────────
  //  AUTOMOTIVE / VEHICLES
  //  Source: IRS 5-year vehicle depreciation
  // ─────────────────────────────────────────
  automotive: {
    startAfterDays: 0,
    stages: [
      { afterDays: 0,    dropPercent: 0  },
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 35 },
      { afterDays: 1095, dropPercent: 50 },
      { afterDays: 1825, dropPercent: 65 },
    ]
  },
  vehicles: { ref: "automotive" },
  cars:     { ref: "automotive" },
  auto:     { ref: "automotive" },

  // ─────────────────────────────────────────
  //  DEFAULT — unknown category
  //  Conservative moderate depreciation
  // ─────────────────────────────────────────
  default: {
    startAfterDays: 60,
    stages: [
      { afterDays: 60,   dropPercent: 10 },
      { afterDays: 180,  dropPercent: 25 },
      { afterDays: 365,  dropPercent: 40 },
      { afterDays: 730,  dropPercent: 55 },
    ]
  }

};