// pricing/depreciationRules.js
//
// VERIFIED REAL-WORLD DEPRECIATION RULES
// Sources:
//   - IRS MACRS depreciation schedules (5-year, 7-year property classes)
//   - ClaimsPages.com depreciation calculator (insurance industry standard)
//   - United Policyholders depreciation guide
//   - Retail industry markdown standards
//
// HOW STAGE-BASED RULES WORK:
//   - "startAfterDays"  → product does NOT depreciate until this age is reached
//   - stages[]          → each stage defines a price DROP % from basePrice once ageDays >= afterDays
//   - "appreciation"    → true means price goes UP (art, antiques, collectibles)
//   - floorPrice from Firestore is always enforced — price never drops below it
//
// CATEGORY NAME MATCHING:
//   The key in this object must match product.categoryName (lowercased) from Firestore
//   Add as many aliases as you need — they all point to the same rule logic

module.exports.DEPRECIATION_RULES = {

  // ─────────────────────────────────────────────────────────
  //  CLOTHES / FASHION
  //  Source: Retail industry markdown standards
  //  Rule: Fresh 30 days → 20% off at 30d → 50% off at 60d → near-clearance at 90d
  // ─────────────────────────────────────────────────────────
  clothes: {
    startAfterDays: 30,
    stages: [
      { afterDays: 30,  dropPercent: 20 },
      { afterDays: 60,  dropPercent: 50 },
      { afterDays: 90,  dropPercent: 70 },
    ]
  },
  fashion:   { ref: "clothes" },
  clothing:  { ref: "clothes" },
  apparel:   { ref: "clothes" },
  garments:  { ref: "clothes" },

  // ─────────────────────────────────────────────────────────
  //  ELECTRONICS
  //  Source: IRS 5-year MACRS property class, ClaimsPages insurance guide
  //  Rule: Starts immediately, steep early drop (tech obsolescence)
  // ─────────────────────────────────────────────────────────
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
  gadgets:  { ref: "electronics" },
  mobiles:  { ref: "electronics" },
  computers:{ ref: "electronics" },
  phones:   { ref: "electronics" },

  // ─────────────────────────────────────────────────────────
  //  FURNITURE
  //  Source: IRS 7-year MACRS property class, ClaimsPages guide
  //  Rule: No depreciation for 6 months, then slow steady drop over 5-7 years
  // ─────────────────────────────────────────────────────────
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
  home:       { ref: "furniture" },
  homewares:  { ref: "furniture" },
  decor:      { ref: "furniture" },

  // ─────────────────────────────────────────────────────────
  //  ART / ANTIQUES / COLLECTIBLES
  //  Source: United Policyholders guide — "antiques, fine art and jewelry
  //          should not be subject to any depreciation" + art market appreciation data
  //  Rule: No change for 1 year, then appreciates slowly (price goes UP)
  //        Capped at 2× basePrice
  // ─────────────────────────────────────────────────────────
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
  antiques:     { ref: "art" },
  collectibles: { ref: "art" },
  paintings:    { ref: "art" },

  // ─────────────────────────────────────────────────────────
  //  SPORTS / SPORTING GOODS
  //  Source: ClaimsPages "Hobbies and Sporting Goods" — useful life ~5 years
  //  Rule: Stable for 60 days, then moderate depreciation
  // ─────────────────────────────────────────────────────────
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
  "sporting goods": { ref: "sports" },
  fitness:          { ref: "sports" },
  outdoors:         { ref: "sports" },

  // ─────────────────────────────────────────────────────────
  //  TOYS / GAMES
  //  Source: ClaimsPages "Toys and Games" — useful life ~3-4 years
  //  Rule: Drops quickly (seasonal demand, trend-based)
  // ─────────────────────────────────────────────────────────
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
  games:   { ref: "toys" },
  kids:    { ref: "toys" },
  "baby items": { ref: "toys" },

  // ─────────────────────────────────────────────────────────
  //  BOOKS / MEDIA
  //  Source: ClaimsPages "Books" — mass-market fiction depreciates quickly,
  //          reference books slower. Using average rule here.
  //  Rule: Starts after 30 days, moderate drop
  // ─────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────
  //  JEWELRY / WATCHES
  //  Source: United Policyholders — "jewelry should not be subject to depreciation"
  //          Fine jewelry holds value; costume jewelry depreciates.
  //  Rule: No depreciation for 1 year, then very slow drop (costume jewelry),
  //        fine jewelry stays stable
  // ─────────────────────────────────────────────────────────
  jewelry: {
    startAfterDays: 365,
    stages: [
      { afterDays: 365,  dropPercent: 5  },
      { afterDays: 730,  dropPercent: 10 },
      { afterDays: 1825, dropPercent: 20 },
    ]
  },
  watches:    { ref: "jewelry" },
  accessories:{ ref: "jewelry" },

  // ─────────────────────────────────────────────────────────
  //  COSMETICS / BEAUTY / PERSONAL CARE
  //  Source: Industry standard — short shelf life, expiry dates
  //  Rule: Starts depreciating after 30 days, drops fast (expiry concern)
  // ─────────────────────────────────────────────────────────
  cosmetics: {
    startAfterDays: 30,
    stages: [
      { afterDays: 30,   dropPercent: 20 },
      { afterDays: 90,   dropPercent: 40 },
      { afterDays: 180,  dropPercent: 60 },
      { afterDays: 270,  dropPercent: 75 },
    ]
  },
  beauty:      { ref: "cosmetics" },
  skincare:    { ref: "cosmetics" },
  "personal care": { ref: "cosmetics" },

  // ─────────────────────────────────────────────────────────
  //  FOOD / GROCERY / PERISHABLES
  //  Rule: Immediate depreciation — expires quickly
  // ─────────────────────────────────────────────────────────
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
  grocery:    { ref: "food" },
  perishables:{ ref: "food" },
  beverages:  { ref: "food" },

  // ─────────────────────────────────────────────────────────
  //  TOOLS / HARDWARE
  //  Source: IRS 5-7 year class, durable goods
  //  Rule: Stable for 90 days, slow depreciation
  // ─────────────────────────────────────────────────────────
  tools: {
    startAfterDays: 90,
    stages: [
      { afterDays: 90,   dropPercent: 5  },
      { afterDays: 365,  dropPercent: 15 },
      { afterDays: 730,  dropPercent: 30 },
      { afterDays: 1825, dropPercent: 50 },
    ]
  },
  hardware:   { ref: "tools" },
  equipment:  { ref: "tools" },

  // ─────────────────────────────────────────────────────────
  //  DEFAULT (unknown / unmatched category)
  //  Conservative moderate depreciation
  // ─────────────────────────────────────────────────────────
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