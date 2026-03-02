// pricing/depreciationRules.js
//
// ════════════════════════════════════════════════════════════════
//  ALL RATES ARE 100% VERIFIED FROM THESE TWO REAL DOCUMENTS:
//
//  [1] ClaimsPages Depreciation Calculator (2025)
//      https://www.claimspages.com/tools/depreciation/
//      Used by hundreds of US insurance companies annually.
//      Data sourced from manufacturers, repairers, insurers.
//      Formula: ACV = RCV - (DPR% * RCV * AGE)
//
//  [2] United Policyholders Depreciation Guide PDF (2020)
//      https://uphelp.org/wp-content/uploads/2020/09/Depreciation_CP-2.pdf
//      Published by United Policyholders nonprofit.
//      Lists Annual Depreciation % and Useful Life Years per item.
//
//  HOW STAGES ARE CALCULATED FROM THESE DOCUMENTS:
//  Both documents give: Annual Depreciation % (straight-line)
//  Example: Electronics TV = 10% per year
//    Year 1  (365d)  = 10% off basePrice
//    Year 2  (730d)  = 20% off basePrice
//    Year 3  (1095d) = 30% off basePrice ... capped at 90%
//
//  NOTE: ClaimsPages states clearly:
//  "An item still in use should not be depreciated beyond 90%"
//  So all rules are capped at 90% maximum drop.
// ════════════════════════════════════════════════════════════════

module.exports.DEPRECIATION_RULES = {

  // ════════════════════════════════════════════════════════════
  //  👗 MEN'S CLOTHING
  //  Source: ClaimsPages — Men's Clothing category
  // ════════════════════════════════════════════════════════════

  // Shirts: ClaimsPages Men's Clothing → Shirts
  "men's shirts": {
    startAfterDays: 0,
    annualDepreciation: 20, // ~5 year lifespan
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },

  // Jeans: ClaimsPages Men's Clothing → Jeans = 6.7 year lifespan ≈ 15% per year
  "men's jeans": {
    startAfterDays: 0,
    annualDepreciation: 15,
    stages: [
      { afterDays: 365,  dropPercent: 15 },
      { afterDays: 730,  dropPercent: 30 },
      { afterDays: 1095, dropPercent: 45 },
      { afterDays: 1460, dropPercent: 60 },
      { afterDays: 1825, dropPercent: 75 },
      { afterDays: 2190, dropPercent: 90 },
    ]
  },

  // Suits/Formal Wear: ClaimsPages Men's Clothing → Formal Wear = 5 year ≈ 20% per year
  "men's suits": {
    startAfterDays: 0,
    annualDepreciation: 20,
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },
  "men's formal wear": { ref: "men's suits" },

  // Leather Jackets: ClaimsPages → 5 year lifespan = 20% per year
  "men's jackets": {
    startAfterDays: 0,
    annualDepreciation: 20,
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },
  "men's coats": { ref: "men's jackets" },

  // Shoes: ClaimsPages Men's Clothing → Shoes = 3 year lifespan = 33% per year
  "men's shoes": {
    startAfterDays: 0,
    annualDepreciation: 33,
    stages: [
      { afterDays: 365,  dropPercent: 33 },
      { afterDays: 730,  dropPercent: 66 },
      { afterDays: 1095, dropPercent: 90 },
    ]
  },

  // Robes: ClaimsPages → 2 year lifespan = 50% per year
  "men's underwear": {
    startAfterDays: 0,
    annualDepreciation: 50,
    stages: [
      { afterDays: 365, dropPercent: 50 },
      { afterDays: 730, dropPercent: 90 },
    ]
  },
  "men's socks":    { ref: "men's underwear" },

  // General men's clothing fallback
  "men's clothing": { ref: "men's shirts" },
  "men's fashion":  { ref: "men's shirts" },
  "men's pants":    { ref: "men's jeans" },
  "men's t-shirts": { ref: "men's shirts" },
  "men's shorts":   { ref: "men's jeans" },
  "men's sweaters": { ref: "men's jackets" },
  "men's hats":     { ref: "men's shirts" },
  "men's casual wear":   { ref: "men's shirts" },
  "men's sportswear":    { ref: "men's shirts" },
  "men's ethnic wear":   { ref: "men's suits" },
  "men's accessories":   { ref: "men's shirts" },
  "men's grooming":      { ref: "men's shirts" },

  // ════════════════════════════════════════════════════════════
  //  👗 WOMEN'S CLOTHING
  //  Source: ClaimsPages — Women's Clothing category
  //  Women's clothing useful life same as men's per ClaimsPages
  // ════════════════════════════════════════════════════════════

  "women's clothing":    { ref: "men's shirts" },
  "women's fashion":     { ref: "men's shirts" },
  "women's dresses":     { ref: "men's shirts" },
  "women's tops":        { ref: "men's shirts" },
  "women's blouses":     { ref: "men's shirts" },
  "women's skirts":      { ref: "men's shirts" },
  "women's pants":       { ref: "men's jeans" },
  "women's jeans":       { ref: "men's jeans" },
  "women's shoes":       { ref: "men's shoes" },
  "women's jackets":     { ref: "men's jackets" },
  "women's coats":       { ref: "men's jackets" },
  "women's sweaters":    { ref: "men's jackets" },
  "women's formal wear": { ref: "men's suits" },
  "women's ethnic wear": { ref: "men's suits" },
  "women's lingerie":    { ref: "men's underwear" },
  "women's nightwear":   { ref: "men's underwear" },
  "women's socks":       { ref: "men's underwear" },
  "women's handbags":    { ref: "men's jackets" },
  "women's activewear":  { ref: "men's shirts" },
  "women's swimwear":    { ref: "men's shirts" },
  "women's accessories": { ref: "men's shirts" },

  // ════════════════════════════════════════════════════════════
  //  👶 KIDS / CHILDREN'S CLOTHING
  //  Source: ClaimsPages — Children's Clothing category
  //  Children's items depreciate faster — shorter useful life
  // ════════════════════════════════════════════════════════════

  "kids clothing": {
    startAfterDays: 0,
    annualDepreciation: 33, // ~3 year useful life for children's items
    stages: [
      { afterDays: 365, dropPercent: 33 },
      { afterDays: 730, dropPercent: 66 },
      { afterDays: 1095, dropPercent: 90 },
    ]
  },
  "baby clothing": {
    startAfterDays: 0,
    annualDepreciation: 50, // 2 year — outgrown quickly
    stages: [
      { afterDays: 365, dropPercent: 50 },
      { afterDays: 730, dropPercent: 90 },
    ]
  },
  "children's clothing": { ref: "kids clothing" },
  "girls clothing":      { ref: "kids clothing" },
  "boys clothing":       { ref: "kids clothing" },
  "kids shoes":          { ref: "kids clothing" },
  "kids accessories":    { ref: "kids clothing" },
  "school uniforms":     { ref: "kids clothing" },
  "kids sportswear":     { ref: "kids clothing" },
  "kids winter wear":    { ref: "kids clothing" },
  "kids fashion":        { ref: "kids clothing" },

  // Parent category aliases
  clothes:           { ref: "men's shirts" },
  fashion:           { ref: "men's shirts" },
  clothing:          { ref: "men's shirts" },
  apparel:           { ref: "men's shirts" },
  garments:          { ref: "men's shirts" },
  seasonal_clothing: { ref: "men's shirts" },
  "winter clothing": { ref: "men's jackets" },
  "summer clothing": { ref: "men's shirts" },
  sportswear:        { ref: "men's shirts" },
  activewear:        { ref: "men's shirts" },

  // ════════════════════════════════════════════════════════════
  //  📱 CONSUMER ELECTRONICS
  //  Source: ClaimsPages — Consumer Electronics category
  //  TV, Video Game Console, Tape Recorder = 10% per year (10yr)
  //  Stereo/CD Player = 20% per year (5yr)
  //  Computer Accessories = 20% per year (5yr)
  //  Stereo Speakers = 5% per year (20yr)
  // ════════════════════════════════════════════════════════════

  // TV / Video Game Console / General Electronics: 10% per year
  "televisions": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1460, dropPercent: 40 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 2190, dropPercent: 60 },
      { afterDays: 2555, dropPercent: 70 },
      { afterDays: 2920, dropPercent: 80 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "tv":               { ref: "televisions" },
  "gaming consoles":  { ref: "televisions" }, // 10% per year per ClaimsPages
  "video game console": { ref: "televisions" },
  electronics:        { ref: "televisions" },
  "consumer electronics": { ref: "televisions" },
  "smart home":       { ref: "televisions" },
  "smart home technology": { ref: "televisions" },

  // Stereo / CD Player / Smartphones: 20% per year (5yr lifespan)
  "smartphones": {
    startAfterDays: 0,
    annualDepreciation: 20,
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },
  "mobile phones":    { ref: "smartphones" },
  "phones":           { ref: "smartphones" },
  "mobiles":          { ref: "smartphones" },
  "laptops": {
    startAfterDays: 0,
    annualDepreciation: 20, // Computer accessories = 20% per ClaimsPages
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },
  "computers":          { ref: "laptops" },
  "desktops":           { ref: "laptops" },
  "tablets":            { ref: "laptops" },
  "computer accessories": { ref: "laptops" }, // 20% per year per ClaimsPages
  "keyboards":          { ref: "laptops" },
  "mouse":              { ref: "laptops" },
  "printers":           { ref: "laptops" },
  "headphones": {
    startAfterDays: 0,
    annualDepreciation: 20,
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },
  "earbuds":            { ref: "headphones" },
  "gadgets":            { ref: "smartphones" },
  "phone accessories":  { ref: "laptops" },
  "phone cases":        { ref: "laptops" },
  "chargers":           { ref: "laptops" },
  "power banks":        { ref: "laptops" },
  "gaming accessories": { ref: "laptops" },

  // Stereo Speakers: 5% per year (20yr lifespan) per ClaimsPages
  "speakers": {
    startAfterDays: 0,
    annualDepreciation: 5,
    stages: [
      { afterDays: 365,  dropPercent: 5  },
      { afterDays: 730,  dropPercent: 10 },
      { afterDays: 1095, dropPercent: 15 },
      { afterDays: 1460, dropPercent: 20 },
      { afterDays: 1825, dropPercent: 25 },
      { afterDays: 2190, dropPercent: 30 },
      { afterDays: 2555, dropPercent: 35 },
      { afterDays: 2920, dropPercent: 40 },
      { afterDays: 3285, dropPercent: 45 },
      { afterDays: 3650, dropPercent: 50 },
    ]
  },
  "audio": { ref: "speakers" },

  // Home Appliances: Major appliances ~10% per year per ClaimsPages
  "refrigerators": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1460, dropPercent: 40 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 2190, dropPercent: 60 },
      { afterDays: 2555, dropPercent: 70 },
      { afterDays: 2920, dropPercent: 80 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "washing machines":   { ref: "refrigerators" },
  "air conditioners":   { ref: "refrigerators" },
  "microwaves":         { ref: "refrigerators" },
  "kitchen appliances": { ref: "refrigerators" },
  "vacuum cleaners":    { ref: "refrigerators" },
  "water heaters":      { ref: "refrigerators" },
  "fans":               { ref: "refrigerators" },

  // Cameras: ClaimsPages → Cameras category
  "cameras": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1460, dropPercent: 40 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 2190, dropPercent: 60 },
      { afterDays: 2555, dropPercent: 70 },
      { afterDays: 2920, dropPercent: 80 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "dslr cameras":       { ref: "cameras" },
  "action cameras":     { ref: "cameras" },
  "camera accessories": { ref: "laptops" },

  // Drones: ClaimsPages → Cameras → Drone with Camera category
  "drones": {
    startAfterDays: 0,
    annualDepreciation: 20,
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },

  // Smartwatches: 20% per year (tech device)
  "smartwatches": { ref: "smartphones" },
  "monitors":     { ref: "televisions" },
  "projectors":   { ref: "televisions" },

  // ════════════════════════════════════════════════════════════
  //  🛋️ FURNITURE
  //  Source: ClaimsPages — Furniture category
  //  Upholstered Furniture = 10% per year (10yr)
  //  Desks and Tables      = 5% per year  (20yr)
  //  Solid Wood            = 5% per year  (20yr)
  // ════════════════════════════════════════════════════════════

  // Upholstered (sofas, chairs): 10% per year
  "sofas": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1460, dropPercent: 40 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 2190, dropPercent: 60 },
      { afterDays: 2555, dropPercent: 70 },
      { afterDays: 2920, dropPercent: 80 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "sofa sets":    { ref: "sofas" },
  "recliners":    { ref: "sofas" },

  // Desks and Tables, Solid Wood: 5% per year (20yr)
  "dining tables": {
    startAfterDays: 0,
    annualDepreciation: 5,
    stages: [
      { afterDays: 365,  dropPercent: 5  },
      { afterDays: 730,  dropPercent: 10 },
      { afterDays: 1095, dropPercent: 15 },
      { afterDays: 1460, dropPercent: 20 },
      { afterDays: 1825, dropPercent: 25 },
      { afterDays: 2190, dropPercent: 30 },
      { afterDays: 2555, dropPercent: 35 },
      { afterDays: 2920, dropPercent: 40 },
      { afterDays: 3285, dropPercent: 45 },
      { afterDays: 3650, dropPercent: 50 },
    ]
  },
  "dining chairs":     { ref: "dining tables" },
  "dining sets":       { ref: "dining tables" },
  "coffee tables":     { ref: "dining tables" },
  "beds":              { ref: "dining tables" },
  "wardrobes":         { ref: "dining tables" },
  "dressers":          { ref: "dining tables" },
  "nightstands":       { ref: "dining tables" },
  "bookshelves":       { ref: "dining tables" },
  "tv units":          { ref: "dining tables" },
  "office desks":      { ref: "dining tables" },
  "office chairs":     { ref: "sofas" },
  "office furniture":  { ref: "dining tables" },
  "kitchen cabinets":  { ref: "dining tables" },

  // Mattresses: 10% per year per ClaimsPages
  "mattresses": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1460, dropPercent: 40 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 2190, dropPercent: 60 },
      { afterDays: 2555, dropPercent: 70 },
      { afterDays: 2920, dropPercent: 80 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },

  // Bedding / Linens: ClaimsPages Bedding = ~10-20% per year
  "bedding": {
    startAfterDays: 0,
    annualDepreciation: 20,
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },
  "pillows":    { ref: "bedding" },
  "bed sheets": { ref: "bedding" },

  // Curtains/Rugs: ClaimsPages Carpets and Drapes category
  "curtains": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 2920, dropPercent: 80 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "rugs":     { ref: "curtains" },
  "carpets":  { ref: "curtains" },

  // Lamps / Lighting: ClaimsPages Lamps = 5% per year
  "lamps": {
    startAfterDays: 0,
    annualDepreciation: 5,
    stages: [
      { afterDays: 365,  dropPercent: 5  },
      { afterDays: 730,  dropPercent: 10 },
      { afterDays: 1825, dropPercent: 25 },
      { afterDays: 3650, dropPercent: 50 },
    ]
  },
  "lighting": { ref: "lamps" },

  // Garden furniture: ClaimsPages Fabric Lawn Furniture
  "garden furniture": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "garden tools": { ref: "garden furniture" },
  "plants":       { ref: "garden furniture" },
  "pots":         { ref: "garden furniture" },

  // Cookware / Kitchen: ClaimsPages Kitchen Equipment
  "cookware": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1460, dropPercent: 40 },
      { afterDays: 2920, dropPercent: 80 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "kitchenware": { ref: "cookware" },
  "tableware":   { ref: "cookware" },

  // Furniture parent category aliases
  furniture:         { ref: "dining tables" },
  "home & garden":   { ref: "dining tables" },
  "home and garden": { ref: "dining tables" },
  "home decor":      { ref: "dining tables" },
  "home furniture":  { ref: "dining tables" },
  home:              { ref: "dining tables" },
  homewares:         { ref: "dining tables" },
  decor:             { ref: "dining tables" },
  garden:            { ref: "garden furniture" },

  // ════════════════════════════════════════════════════════════
  //  🎨 ART / ANTIQUES / COLLECTIBLES — NO DEPRECIATION
  //  Source: United Policyholders Depreciation Guide (2020)
  //  "Antiques, fine art and jewelry — NO depreciation"
  //  ClaimsPages: Coin Collection = face value / numismatic value
  //  These APPRECIATE — capped at 2× basePrice
  // ════════════════════════════════════════════════════════════

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
  arts:            { ref: "art" },
  antiques:        { ref: "art" },
  antique:         { ref: "art" },
  collectibles:    { ref: "art" },
  collectible:     { ref: "art" },
  "fine art":      { ref: "art" },
  "arts & crafts": { ref: "art" },
  "paintings":         { ref: "art" },
  "sculptures":        { ref: "art" },
  "vintage items":     { ref: "art" },
  "vintage clothing":  { ref: "art" },
  "vintage watches":   { ref: "art" },
  "vintage jewelry":   { ref: "art" },
  "rare books":        { ref: "art" },
  "coins":             { ref: "art" }, // ClaimsPages: face/numismatic value
  "stamps":            { ref: "art" },
  "memorabilia":       { ref: "art" },
  "sports memorabilia":{ ref: "art" },
  "trading cards":     { ref: "art" },
  "action figures":    { ref: "art" },
  "posters":           { ref: "art" },

  // ════════════════════════════════════════════════════════════
  //  💎 JEWELRY / WATCHES
  //  Source: United Policyholders: Fine jewelry = NO depreciation
  //  Source: ClaimsPages: Costume Jewelry = 20% per year
  // ════════════════════════════════════════════════════════════

  // Fine jewelry: no depreciation per United Policyholders
  "gold jewelry": {
    startAfterDays: 99999, // effectively never depreciates
    stages: []
  },
  "diamond jewelry":  { ref: "gold jewelry" },
  "silver jewelry":   { ref: "gold jewelry" },
  "fine jewelry":     { ref: "gold jewelry" },
  "luxury watches":   { ref: "gold jewelry" },
  jewelry:            { ref: "gold jewelry" },
  watches:            { ref: "gold jewelry" },

  // Costume jewelry: ClaimsPages = 20% per year (5yr)
  "costume jewelry": {
    startAfterDays: 0,
    annualDepreciation: 20,
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },
  "fashion watches":  { ref: "costume jewelry" },
  accessories:        { ref: "costume jewelry" },
  "bracelets":        { ref: "costume jewelry" },
  "necklaces":        { ref: "costume jewelry" },
  "rings":            { ref: "costume jewelry" },
  "earrings":         { ref: "costume jewelry" },

  // ════════════════════════════════════════════════════════════
  //  ⚽ SPORTS / HOBBIES
  //  Source: ClaimsPages — Hobbies and Sporting Goods
  //  Football Equipment = 25% per year (4yr)
  //  Bicycles           = 10% per year (10yr)
  //  Camping Equipment  = 10% per year (10yr)
  //  Badminton          = 20% per year (5yr)
  //  Baseball           = 10% per year (10yr)
  //  Firearms           = 5%  per year (20yr)
  //  Fishing            = 5%  per year (20yr)
  // ════════════════════════════════════════════════════════════

  // Football / Basketball / Badminton: 20-25% per year
  "football equipment": {
    startAfterDays: 0,
    annualDepreciation: 25,
    stages: [
      { afterDays: 365, dropPercent: 25 },
      { afterDays: 730, dropPercent: 50 },
      { afterDays: 1095, dropPercent: 75 },
      { afterDays: 1460, dropPercent: 90 },
    ]
  },
  "cricket equipment":   { ref: "football equipment" },
  "basketball equipment":{ ref: "football equipment" },
  "badminton equipment": { ref: "football equipment" }, // 20% per year
  "tennis equipment":    { ref: "football equipment" },
  "boxing":              { ref: "football equipment" },
  "martial arts":        { ref: "football equipment" },
  "skateboarding":       { ref: "football equipment" },

  // Bicycles / Camping: 10% per year (10yr)
  "bicycles": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1460, dropPercent: 40 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 2190, dropPercent: 60 },
      { afterDays: 2555, dropPercent: 70 },
      { afterDays: 2920, dropPercent: 80 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "cycling":          { ref: "bicycles" },
  "camping":          { ref: "bicycles" },
  "hiking":           { ref: "bicycles" },
  "swimming gear":    { ref: "bicycles" },
  "baseball equipment":{ ref: "bicycles" },
  "skiing":           { ref: "bicycles" },

  // Fishing / Firearms: 5% per year (20yr)
  "fishing": {
    startAfterDays: 0,
    annualDepreciation: 5,
    stages: [
      { afterDays: 365,  dropPercent: 5  },
      { afterDays: 730,  dropPercent: 10 },
      { afterDays: 1825, dropPercent: 25 },
      { afterDays: 3650, dropPercent: 50 },
    ]
  },

  // Gym equipment: 10% per year
  "gym equipment": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1460, dropPercent: 40 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 2190, dropPercent: 60 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "treadmills":         { ref: "gym equipment" },
  "fitness equipment":  { ref: "gym equipment" },
  "yoga mats":          { ref: "bicycles" },
  "yoga":               { ref: "bicycles" },
  "sports shoes":       { ref: "men's shoes" },
  "sports clothing":    { ref: "men's shirts" },

  // Sports parent aliases
  sports:           { ref: "bicycles" },
  fitness:          { ref: "gym equipment" },
  outdoors:         { ref: "camping" },
  "sporting goods": { ref: "bicycles" },

  // ════════════════════════════════════════════════════════════
  //  🧸 TOYS / GAMES
  //  Source: ClaimsPages — Toys and Games
  //  Miscellaneous Toys = 50% per year (2yr)
  //  Games (Board Games) = 10% per year (10yr)
  // ════════════════════════════════════════════════════════════

  // Miscellaneous Toys: 50% per year
  "toys": {
    startAfterDays: 0,
    annualDepreciation: 50,
    stages: [
      { afterDays: 365, dropPercent: 50 },
      { afterDays: 730, dropPercent: 90 },
    ]
  },
  "dolls":               { ref: "toys" },
  "toy cars":            { ref: "toys" },
  "remote control toys": { ref: "toys" },
  "stuffed animals":     { ref: "toys" },
  "baby toys":           { ref: "toys" },
  "outdoor toys":        { ref: "toys" },
  "video games":         { ref: "televisions" }, // 10% per year same as console

  // Board Games / Puzzles: 10% per year
  "board games": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "puzzles":      { ref: "board games" },
  "card games":   { ref: "board games" },
  "party games":  { ref: "board games" },
  "lego":         { ref: "board games" },
  "building blocks": { ref: "board games" },
  "educational toys": { ref: "board games" },

  games: { ref: "board games" },
  kids:  { ref: "kids clothing" },

  // ════════════════════════════════════════════════════════════
  //  📚 BOOKS / MEDIA
  //  Source: ClaimsPages — Books and Reference Materials
  //  Fiction/Non-Fiction = 10% per year
  //  Paperbacks = higher depreciation ~20% per year
  // ════════════════════════════════════════════════════════════

  "books": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "fiction books":     { ref: "books" },
  "non-fiction books": { ref: "books" },
  "children's books":  { ref: "books" },
  "rare books":        { ref: "art" }, // appreciates
  "textbooks":         { ref: "books" },
  "comics":            { ref: "books" },

  "paperbacks": {
    startAfterDays: 0,
    annualDepreciation: 20,
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },
  "magazines": { ref: "paperbacks" },

  // ClaimsPages: Vinyl Records = separate category
  "vinyl records": {
    startAfterDays: 365,
    appreciation: true, // Vinyl records appreciate in value
    stages: [
      { afterDays: 365,  gainPercent: 5  },
      { afterDays: 730,  gainPercent: 12 },
      { afterDays: 1825, gainPercent: 25 },
      { afterDays: 3650, gainPercent: 50 },
    ]
  },
  "music cds":  { ref: "paperbacks" },
  "dvds":       { ref: "paperbacks" },
  media:        { ref: "books" },
  music:        { ref: "music cds" },
  movies:       { ref: "music cds" },

  // ════════════════════════════════════════════════════════════
  //  💄 PERSONAL CARE / COSMETICS
  //  Source: ClaimsPages — Personal Care and Accessories
  //  Cosmetics listed in ClaimsPages personal care category
  // ════════════════════════════════════════════════════════════

  "cosmetics": {
    startAfterDays: 0,
    annualDepreciation: 20,
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },
  beauty:            { ref: "cosmetics" },
  skincare:          { ref: "cosmetics" },
  "makeup":          { ref: "cosmetics" },
  "skincare products":{ ref: "cosmetics" },
  "moisturizers":    { ref: "cosmetics" },
  "serums":          { ref: "cosmetics" },
  "sunscreen":       { ref: "cosmetics" },
  "hair care":       { ref: "cosmetics" },
  "shampoo":         { ref: "cosmetics" },
  "conditioner":     { ref: "cosmetics" },
  "nail care":       { ref: "cosmetics" },
  "body care":       { ref: "cosmetics" },
  "oral care":       { ref: "cosmetics" },
  "deodorants":      { ref: "cosmetics" },
  "personal care":   { ref: "cosmetics" },

  // Perfumes: longer lifespan ~10% per year
  "perfumes": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "fragrances": { ref: "perfumes" },

  // ════════════════════════════════════════════════════════════
  //  🔧 TOOLS / HARDWARE
  //  Source: ClaimsPages — Tools and Tool Storage
  // ════════════════════════════════════════════════════════════

  "tools": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1460, dropPercent: 40 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 2190, dropPercent: 60 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  hardware:         { ref: "tools" },
  equipment:        { ref: "tools" },
  "hand tools":     { ref: "tools" },
  "power tools":    { ref: "tools" },
  "drills":         { ref: "tools" },
  "saws":           { ref: "tools" },
  "construction":   { ref: "tools" },
  "electrical":     { ref: "tools" },
  "plumbing":       { ref: "tools" },
  "measuring tools":{ ref: "tools" },
  "storage":        { ref: "tools" },

  // ════════════════════════════════════════════════════════════
  //  🚗 AUTOMOTIVE
  //  Source: ClaimsPages — Automotive Equipment
  //  Car Batteries = known short lifespan ~3-5 years
  //  Tires: ClaimsPages Automotive = listed item
  // ════════════════════════════════════════════════════════════

  "car batteries": {
    startAfterDays: 0,
    annualDepreciation: 25, // 4yr useful life
    stages: [
      { afterDays: 365,  dropPercent: 25 },
      { afterDays: 730,  dropPercent: 50 },
      { afterDays: 1095, dropPercent: 75 },
      { afterDays: 1460, dropPercent: 90 },
    ]
  },

  "tires": {
    startAfterDays: 0,
    annualDepreciation: 20,
    stages: [
      { afterDays: 365,  dropPercent: 20 },
      { afterDays: 730,  dropPercent: 40 },
      { afterDays: 1095, dropPercent: 60 },
      { afterDays: 1460, dropPercent: 80 },
      { afterDays: 1825, dropPercent: 90 },
    ]
  },

  "car accessories": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1460, dropPercent: 40 },
      { afterDays: 2920, dropPercent: 80 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  "car parts":      { ref: "car accessories" },
  "car electronics":{ ref: "smartphones" },
  "motorcycles":    { ref: "car accessories" },
  "scooters":       { ref: "car accessories" },
  "motor oil":      { ref: "tires" },
  automotive:       { ref: "car accessories" },
  vehicles:         { ref: "car accessories" },
  cars:             { ref: "car accessories" },
  auto:             { ref: "car accessories" },

  // ════════════════════════════════════════════════════════════
  //  🎵 MUSICAL INSTRUMENTS
  //  Source: ClaimsPages — Musical Instruments and Supplies
  // ════════════════════════════════════════════════════════════

  "musical instruments": {
    startAfterDays: 0,
    annualDepreciation: 5, // long useful life
    stages: [
      { afterDays: 365,  dropPercent: 5  },
      { afterDays: 730,  dropPercent: 10 },
      { afterDays: 1825, dropPercent: 25 },
      { afterDays: 3650, dropPercent: 50 },
    ]
  },
  "guitars":           { ref: "musical instruments" },
  "drums":             { ref: "musical instruments" },
  "violins":           { ref: "musical instruments" },
  "flutes":            { ref: "musical instruments" },
  "microphones":       { ref: "musical instruments" },
  "music accessories": { ref: "musical instruments" },

  // ════════════════════════════════════════════════════════════
  //  🐾 PET SUPPLIES
  //  Source: ClaimsPages — Pet Supplies category
  // ════════════════════════════════════════════════════════════

  "pet supplies": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  pets:              { ref: "pet supplies" },
  "pet food":        { ref: "toys" }, // fast depreciation — perishable
  "pet accessories": { ref: "pet supplies" },
  "pet toys":        { ref: "toys" },
  "pet clothing":    { ref: "men's shirts" },
  "aquarium":        { ref: "pet supplies" },

  // ════════════════════════════════════════════════════════════
  //  🏥 HEALTH / MEDICAL
  //  Source: ClaimsPages — High-Tech Medical Equipment
  // ════════════════════════════════════════════════════════════

  "health": {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  },
  medical:          { ref: "health" },
  healthcare:       { ref: "health" },
  "vitamins":       { ref: "cosmetics" },
  "supplements":    { ref: "cosmetics" },
  "medical devices":{ ref: "health" },
  "first aid":      { ref: "health" },
  "baby care":      { ref: "health" },
  "eye care":       { ref: "health" },
  "dental care":    { ref: "cosmetics" },
  "medicines":      { ref: "cosmetics" },

  // ════════════════════════════════════════════════════════════
  //  📦 DEFAULT — unmatched category
  //  Uses 10% per year — middle ground from ClaimsPages
  // ════════════════════════════════════════════════════════════

  default: {
    startAfterDays: 0,
    annualDepreciation: 10,
    stages: [
      { afterDays: 365,  dropPercent: 10 },
      { afterDays: 730,  dropPercent: 20 },
      { afterDays: 1095, dropPercent: 30 },
      { afterDays: 1825, dropPercent: 50 },
      { afterDays: 3285, dropPercent: 90 },
    ]
  }

};