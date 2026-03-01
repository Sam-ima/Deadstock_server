// pricing/depreciationRules.js
//
// VERIFIED REAL-WORLD DEPRECIATION & APPRECIATION RULES
// Based on SUBCATEGORY level — more precise pricing
//
// Sources:
//   - IRS Publication 946 — MACRS depreciation schedules
//   - ClaimsPages.com insurance depreciation calculator
//   - United Policyholders Depreciation Guide
//   - Retail industry 30/60/90 day markdown standards
//
// HOW IT WORKS:
//   1. System first checks subcategoryName (more specific)
//   2. If no subcategory match → falls back to categoryName
//   3. If no category match → uses "default"
//
//   "startAfterDays" → no price change until product reaches this age
//   "stages"         → dropPercent is always calculated from basePrice
//   "appreciation"   → price goes UP instead of down
//   floorPrice from Firestore is always enforced

module.exports.DEPRECIATION_RULES = {

  // ═══════════════════════════════════════════════════════════
  //  👗 CLOTHES / FASHION
  //  Source: Retail 30/60/90 day markdown standard
  // ═══════════════════════════════════════════════════════════

  // Parent category fallback
  clothes:  { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 60, dropPercent: 50 }, { afterDays: 90, dropPercent: 70 }] },
  fashion:  { ref: "clothes" },
  clothing: { ref: "clothes" },
  apparel:  { ref: "clothes" },

  // Subcategories — Men
  "men's clothing":     { ref: "clothes" },
  "men's fashion":      { ref: "clothes" },
  "men's shirts":       { ref: "clothes" },
  "men's pants":        { ref: "clothes" },
  "men's suits":        { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 15 }, { afterDays: 120, dropPercent: 35 }, { afterDays: 180, dropPercent: 55 }] },
  "men's jeans":        { ref: "clothes" },
  "men's t-shirts":     { ref: "clothes" },
  "men's jackets":      { startAfterDays: 45, stages: [{ afterDays: 45, dropPercent: 15 }, { afterDays: 90, dropPercent: 40 }, { afterDays: 180, dropPercent: 65 }] },
  "men's shoes":        { startAfterDays: 45, stages: [{ afterDays: 45, dropPercent: 15 }, { afterDays: 90, dropPercent: 35 }, { afterDays: 180, dropPercent: 55 }] },
  "men's accessories":  { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 20 }, { afterDays: 120, dropPercent: 45 }, { afterDays: 240, dropPercent: 65 }] },
  "men's sportswear":   { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 60, dropPercent: 45 }, { afterDays: 90, dropPercent: 65 }] },
  "men's underwear":    { ref: "clothes" },
  "men's sweaters":     { startAfterDays: 45, stages: [{ afterDays: 45, dropPercent: 15 }, { afterDays: 90, dropPercent: 40 }, { afterDays: 180, dropPercent: 60 }] },
  "men's shorts":       { ref: "clothes" },
  "men's coats":        { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 15 }, { afterDays: 120, dropPercent: 35 }, { afterDays: 240, dropPercent: 60 }] },
  "men's hats":         { ref: "clothes" },
  "men's socks":        { ref: "clothes" },
  "men's formal wear":  { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 10 }, { afterDays: 180, dropPercent: 30 }, { afterDays: 365, dropPercent: 50 }] },
  "men's casual wear":  { ref: "clothes" },
  "men's ethnic wear":  { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 15 }, { afterDays: 120, dropPercent: 35 }, { afterDays: 240, dropPercent: 55 }] },

  // Subcategories — Women
  "women's clothing":    { ref: "clothes" },
  "women's fashion":     { ref: "clothes" },
  "women's dresses":     { ref: "clothes" },
  "women's tops":        { ref: "clothes" },
  "women's blouses":     { ref: "clothes" },
  "women's skirts":      { ref: "clothes" },
  "women's pants":       { ref: "clothes" },
  "women's jeans":       { ref: "clothes" },
  "women's shoes":       { startAfterDays: 45, stages: [{ afterDays: 45, dropPercent: 15 }, { afterDays: 90, dropPercent: 35 }, { afterDays: 180, dropPercent: 55 }] },
  "women's handbags":    { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 10 }, { afterDays: 180, dropPercent: 30 }, { afterDays: 365, dropPercent: 50 }] },
  "women's jackets":     { startAfterDays: 45, stages: [{ afterDays: 45, dropPercent: 15 }, { afterDays: 90, dropPercent: 40 }, { afterDays: 180, dropPercent: 65 }] },
  "women's coats":       { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 15 }, { afterDays: 120, dropPercent: 35 }, { afterDays: 240, dropPercent: 60 }] },
  "women's sweaters":    { startAfterDays: 45, stages: [{ afterDays: 45, dropPercent: 15 }, { afterDays: 90, dropPercent: 40 }, { afterDays: 180, dropPercent: 60 }] },
  "women's activewear":  { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 60, dropPercent: 45 }, { afterDays: 90, dropPercent: 65 }] },
  "women's swimwear":    { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 25 }, { afterDays: 60, dropPercent: 55 }, { afterDays: 90, dropPercent: 75 }] },
  "women's lingerie":    { ref: "clothes" },
  "women's ethnic wear": { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 15 }, { afterDays: 120, dropPercent: 35 }, { afterDays: 240, dropPercent: 55 }] },
  "women's accessories": { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 20 }, { afterDays: 120, dropPercent: 45 }, { afterDays: 240, dropPercent: 65 }] },
  "women's formal wear": { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 10 }, { afterDays: 180, dropPercent: 30 }, { afterDays: 365, dropPercent: 50 }] },
  "women's nightwear":   { ref: "clothes" },
  "women's socks":       { ref: "clothes" },

  // Subcategories — Kids / Children
  "kids clothing":       { startAfterDays: 20, stages: [{ afterDays: 20, dropPercent: 25 }, { afterDays: 45, dropPercent: 55 }, { afterDays: 75, dropPercent: 75 }] },
  "kids fashion":        { ref: "kids clothing" },
  "children's clothing": { ref: "kids clothing" },
  "kids shoes":          { startAfterDays: 20, stages: [{ afterDays: 20, dropPercent: 20 }, { afterDays: 45, dropPercent: 50 }, { afterDays: 90, dropPercent: 70 }] },
  "baby clothing":       { startAfterDays: 15, stages: [{ afterDays: 15, dropPercent: 25 }, { afterDays: 30, dropPercent: 55 }, { afterDays: 60, dropPercent: 75 }] },
  "girls clothing":      { ref: "kids clothing" },
  "boys clothing":       { ref: "kids clothing" },
  "kids accessories":    { ref: "kids clothing" },
  "school uniforms":     { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 90, dropPercent: 45 }, { afterDays: 180, dropPercent: 65 }] },
  "kids sportswear":     { ref: "kids clothing" },
  "kids winter wear":    { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 90, dropPercent: 50 }, { afterDays: 180, dropPercent: 70 }] },

  // Seasonal
  seasonal_clothing: { startAfterDays: 20, stages: [{ afterDays: 20, dropPercent: 25 }, { afterDays: 45, dropPercent: 55 }, { afterDays: 75, dropPercent: 75 }] },
  "winter clothing": { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 90, dropPercent: 50 }, { afterDays: 180, dropPercent: 70 }] },
  "summer clothing": { startAfterDays: 20, stages: [{ afterDays: 20, dropPercent: 25 }, { afterDays: 45, dropPercent: 55 }, { afterDays: 75, dropPercent: 75 }] },
  "sportswear":      { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 60, dropPercent: 45 }, { afterDays: 90, dropPercent: 65 }] },
  "activewear":      { ref: "sportswear" },
  garments:          { ref: "clothes" },

  // ═══════════════════════════════════════════════════════════
  //  📱 ELECTRONICS
  //  Source: IRS MACRS 5-Year Property Class
  // ═══════════════════════════════════════════════════════════

  electronics: { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 10 }, { afterDays: 180, dropPercent: 20 }, { afterDays: 365, dropPercent: 35 }, { afterDays: 730, dropPercent: 55 }, { afterDays: 1095, dropPercent: 70 }] },

  // Mobile & Phones
  "smartphones":         { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 60, dropPercent: 15 }, { afterDays: 180, dropPercent: 30 }, { afterDays: 365, dropPercent: 45 }, { afterDays: 730, dropPercent: 65 }] },
  "mobile phones":       { ref: "smartphones" },
  "phones":              { ref: "smartphones" },
  "feature phones":      { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 10 }, { afterDays: 365, dropPercent: 30 }, { afterDays: 730, dropPercent: 50 }] },
  "phone accessories":   { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 15 }, { afterDays: 90, dropPercent: 30 }, { afterDays: 180, dropPercent: 50 }, { afterDays: 365, dropPercent: 65 }] },
  "phone cases":         { ref: "phone accessories" },
  "chargers":            { ref: "phone accessories" },
  "power banks":         { ref: "phone accessories" },

  // Computers
  "laptops":             { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 12 }, { afterDays: 180, dropPercent: 22 }, { afterDays: 365, dropPercent: 38 }, { afterDays: 730, dropPercent: 58 }, { afterDays: 1095, dropPercent: 72 }] },
  "computers":           { ref: "laptops" },
  "desktops":            { ref: "laptops" },
  "tablets":             { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 10 }, { afterDays: 180, dropPercent: 20 }, { afterDays: 365, dropPercent: 35 }, { afterDays: 730, dropPercent: 55 }] },
  "computer accessories":{ startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 10 }, { afterDays: 180, dropPercent: 25 }, { afterDays: 365, dropPercent: 40 }, { afterDays: 730, dropPercent: 55 }] },
  "monitors":            { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 8 }, { afterDays: 365, dropPercent: 25 }, { afterDays: 730, dropPercent: 45 }, { afterDays: 1095, dropPercent: 60 }] },
  "keyboards":           { ref: "computer accessories" },
  "mouse":               { ref: "computer accessories" },
  "printers":            { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 180, dropPercent: 15 }, { afterDays: 365, dropPercent: 30 }, { afterDays: 730, dropPercent: 50 }, { afterDays: 1825, dropPercent: 65 }] },

  // Audio & Video
  "headphones":          { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 10 }, { afterDays: 180, dropPercent: 20 }, { afterDays: 365, dropPercent: 35 }, { afterDays: 730, dropPercent: 55 }] },
  "earbuds":             { ref: "headphones" },
  "speakers":            { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 8 }, { afterDays: 180, dropPercent: 18 }, { afterDays: 365, dropPercent: 32 }, { afterDays: 730, dropPercent: 50 }] },
  "televisions":         { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 180, dropPercent: 15 }, { afterDays: 365, dropPercent: 28 }, { afterDays: 730, dropPercent: 45 }, { afterDays: 1095, dropPercent: 60 }] },
  "tv":                  { ref: "televisions" },
  "projectors":          { ref: "televisions" },
  "audio":               { ref: "speakers" },

  // Cameras & Drones
  "cameras":             { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 8 }, { afterDays: 180, dropPercent: 18 }, { afterDays: 365, dropPercent: 32 }, { afterDays: 730, dropPercent: 50 }, { afterDays: 1095, dropPercent: 65 }] },
  "dslr cameras":        { ref: "cameras" },
  "action cameras":      { ref: "cameras" },
  "camera accessories":  { ref: "computer accessories" },
  "drones":              { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 12 }, { afterDays: 180, dropPercent: 25 }, { afterDays: 365, dropPercent: 40 }, { afterDays: 730, dropPercent: 60 }] },

  // Smart Devices
  "smartwatches":        { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 12 }, { afterDays: 180, dropPercent: 25 }, { afterDays: 365, dropPercent: 40 }, { afterDays: 730, dropPercent: 58 }] },
  "smart home":          { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 10 }, { afterDays: 365, dropPercent: 28 }, { afterDays: 730, dropPercent: 48 }] },
  "gaming consoles":     { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 180, dropPercent: 10 }, { afterDays: 365, dropPercent: 25 }, { afterDays: 730, dropPercent: 40 }, { afterDays: 1095, dropPercent: 55 }] },
  "gaming accessories":  { ref: "computer accessories" },
  "gadgets":             { ref: "electronics" },
  "mobiles":             { ref: "smartphones" },
  "consumer electronics":{ ref: "electronics" },

  // Home Appliances
  "refrigerators":       { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 180, dropPercent: 8 }, { afterDays: 365, dropPercent: 18 }, { afterDays: 730, dropPercent: 30 }, { afterDays: 1825, dropPercent: 50 }] },
  "washing machines":    { ref: "refrigerators" },
  "air conditioners":    { ref: "refrigerators" },
  "microwaves":          { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 180, dropPercent: 10 }, { afterDays: 365, dropPercent: 22 }, { afterDays: 730, dropPercent: 38 }, { afterDays: 1825, dropPercent: 55 }] },
  "kitchen appliances":  { ref: "microwaves" },
  "vacuum cleaners":     { ref: "microwaves" },
  "water heaters":       { ref: "refrigerators" },
  "fans":                { ref: "microwaves" },

  // ═══════════════════════════════════════════════════════════
  //  🛋️ FURNITURE / HOME & GARDEN
  //  Source: IRS MACRS 7-Year Property Class
  // ═══════════════════════════════════════════════════════════

  furniture: { startAfterDays: 180, stages: [{ afterDays: 180, dropPercent: 5 }, { afterDays: 365, dropPercent: 15 }, { afterDays: 730, dropPercent: 25 }, { afterDays: 1095, dropPercent: 35 }, { afterDays: 1825, dropPercent: 50 }] },
  "home & garden":   { ref: "furniture" },
  "home and garden": { ref: "furniture" },
  "home decor":      { ref: "furniture" },
  "home furniture":  { ref: "furniture" },
  home:              { ref: "furniture" },
  homewares:         { ref: "furniture" },
  decor:             { ref: "furniture" },
  garden:            { ref: "furniture" },

  // Living Room
  "sofas":           { startAfterDays: 180, stages: [{ afterDays: 180, dropPercent: 5 }, { afterDays: 365, dropPercent: 12 }, { afterDays: 730, dropPercent: 22 }, { afterDays: 1095, dropPercent: 35 }, { afterDays: 1825, dropPercent: 50 }] },
  "sofa sets":       { ref: "sofas" },
  "recliners":       { ref: "sofas" },
  "coffee tables":   { startAfterDays: 180, stages: [{ afterDays: 180, dropPercent: 5 }, { afterDays: 365, dropPercent: 15 }, { afterDays: 730, dropPercent: 28 }, { afterDays: 1825, dropPercent: 50 }] },
  "tv units":        { ref: "coffee tables" },
  "bookshelves":     { ref: "coffee tables" },
  "curtains":        { startAfterDays: 90, stages: [{ afterDays: 90, dropPercent: 10 }, { afterDays: 365, dropPercent: 25 }, { afterDays: 730, dropPercent: 45 }, { afterDays: 1095, dropPercent: 60 }] },
  "rugs":            { ref: "curtains" },
  "carpets":         { ref: "curtains" },
  "lamps":           { ref: "coffee tables" },
  "lighting":        { ref: "coffee tables" },

  // Bedroom
  "beds":            { startAfterDays: 180, stages: [{ afterDays: 180, dropPercent: 5 }, { afterDays: 365, dropPercent: 12 }, { afterDays: 730, dropPercent: 22 }, { afterDays: 1095, dropPercent: 35 }, { afterDays: 1825, dropPercent: 50 }] },
  "mattresses":      { startAfterDays: 90, stages: [{ afterDays: 90, dropPercent: 8 }, { afterDays: 365, dropPercent: 20 }, { afterDays: 730, dropPercent: 35 }, { afterDays: 1825, dropPercent: 55 }] },
  "wardrobes":       { ref: "beds" },
  "dressers":        { ref: "beds" },
  "nightstands":     { ref: "beds" },
  "bedding":         { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 10 }, { afterDays: 180, dropPercent: 25 }, { afterDays: 365, dropPercent: 45 }, { afterDays: 730, dropPercent: 60 }] },
  "pillows":         { ref: "bedding" },
  "bed sheets":      { ref: "bedding" },

  // Dining & Kitchen
  "dining tables":   { startAfterDays: 180, stages: [{ afterDays: 180, dropPercent: 5 }, { afterDays: 365, dropPercent: 15 }, { afterDays: 730, dropPercent: 28 }, { afterDays: 1825, dropPercent: 50 }] },
  "dining chairs":   { ref: "dining tables" },
  "dining sets":     { ref: "dining tables" },
  "kitchen cabinets":{ startAfterDays: 180, stages: [{ afterDays: 180, dropPercent: 5 }, { afterDays: 365, dropPercent: 12 }, { afterDays: 730, dropPercent: 25 }, { afterDays: 1825, dropPercent: 45 }] },
  "cookware":        { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 8 }, { afterDays: 365, dropPercent: 20 }, { afterDays: 730, dropPercent: 38 }, { afterDays: 1825, dropPercent: 55 }] },
  "kitchenware":     { ref: "cookware" },
  "tableware":       { ref: "cookware" },

  // Office
  "office chairs":   { startAfterDays: 180, stages: [{ afterDays: 180, dropPercent: 5 }, { afterDays: 365, dropPercent: 15 }, { afterDays: 730, dropPercent: 28 }, { afterDays: 1825, dropPercent: 50 }] },
  "office desks":    { ref: "office chairs" },
  "office furniture":{ ref: "office chairs" },

  // Garden
  "garden furniture":{ startAfterDays: 90, stages: [{ afterDays: 90, dropPercent: 8 }, { afterDays: 365, dropPercent: 20 }, { afterDays: 730, dropPercent: 35 }, { afterDays: 1825, dropPercent: 55 }] },
  "garden tools":    { startAfterDays: 90, stages: [{ afterDays: 90, dropPercent: 5 }, { afterDays: 365, dropPercent: 15 }, { afterDays: 730, dropPercent: 30 }, { afterDays: 1825, dropPercent: 50 }] },
  "plants":          { startAfterDays: 7, stages: [{ afterDays: 7, dropPercent: 10 }, { afterDays: 30, dropPercent: 25 }, { afterDays: 90, dropPercent: 50 }, { afterDays: 180, dropPercent: 70 }] },
  "pots":            { ref: "garden furniture" },

  // ═══════════════════════════════════════════════════════════
  //  🎨 ART / ANTIQUES / COLLECTIBLES — APPRECIATION
  //  Source: United Policyholders Guide
  // ═══════════════════════════════════════════════════════════

  art: { startAfterDays: 365, appreciation: true, stages: [{ afterDays: 365, gainPercent: 5 }, { afterDays: 730, gainPercent: 12 }, { afterDays: 1095, gainPercent: 20 }, { afterDays: 1825, gainPercent: 35 }, { afterDays: 3650, gainPercent: 80 }] },
  arts:            { ref: "art" },
  antiques:        { ref: "art" },
  antique:         { ref: "art" },
  collectibles:    { ref: "art" },
  collectible:     { ref: "art" },
  "fine art":      { ref: "art" },
  "arts & crafts": { ref: "art" },

  // Subcategories
  "paintings":         { ref: "art" },
  "sculptures":        { startAfterDays: 365, appreciation: true, stages: [{ afterDays: 365, gainPercent: 4 }, { afterDays: 730, gainPercent: 10 }, { afterDays: 1825, gainPercent: 25 }, { afterDays: 3650, gainPercent: 60 }] },
  "vintage items":     { ref: "art" },
  "vintage clothing":  { ref: "art" },
  "vintage watches":   { ref: "art" },
  "vintage jewelry":   { ref: "art" },
  "rare books":        { ref: "art" },
  "stamps":            { ref: "art" },
  "coins":             { ref: "art" },
  "posters":           { startAfterDays: 365, appreciation: true, stages: [{ afterDays: 365, gainPercent: 3 }, { afterDays: 730, gainPercent: 8 }, { afterDays: 1825, gainPercent: 18 }, { afterDays: 3650, gainPercent: 40 }] },
  "photography prints":{ ref: "posters" },
  "ceramics":          { ref: "sculptures" },
  "glassware antiques":{ ref: "sculptures" },
  "rugs antiques":     { ref: "art" },
  "furniture antiques":{ ref: "art" },
  "musical instruments antiques": { ref: "art" },
  "memorabilia":       { ref: "art" },
  "sports memorabilia":{ ref: "art" },
  "trading cards":     { ref: "art" },
  "action figures":    { startAfterDays: 365, appreciation: true, stages: [{ afterDays: 365, gainPercent: 3 }, { afterDays: 730, gainPercent: 8 }, { afterDays: 1825, gainPercent: 20 }, { afterDays: 3650, gainPercent: 50 }] },

  // ═══════════════════════════════════════════════════════════
  //  💎 JEWELRY / WATCHES
  //  Source: United Policyholders Guide
  // ═══════════════════════════════════════════════════════════

  jewelry: { startAfterDays: 365, stages: [{ afterDays: 365, dropPercent: 5 }, { afterDays: 730, dropPercent: 10 }, { afterDays: 1825, dropPercent: 20 }] },
  watches:      { ref: "jewelry" },
  accessories:  { ref: "jewelry" },

  "gold jewelry":    { startAfterDays: 730, stages: [{ afterDays: 730, dropPercent: 3 }, { afterDays: 1825, dropPercent: 8 }] },
  "silver jewelry":  { ref: "jewelry" },
  "diamond jewelry": { startAfterDays: 730, stages: [{ afterDays: 730, dropPercent: 3 }, { afterDays: 1825, dropPercent: 8 }] },
  "costume jewelry": { startAfterDays: 90, stages: [{ afterDays: 90, dropPercent: 15 }, { afterDays: 365, dropPercent: 35 }, { afterDays: 730, dropPercent: 55 }] },
  "luxury watches":  { startAfterDays: 730, stages: [{ afterDays: 730, dropPercent: 3 }, { afterDays: 1825, dropPercent: 8 }] },
  "fashion watches": { startAfterDays: 90, stages: [{ afterDays: 90, dropPercent: 10 }, { afterDays: 365, dropPercent: 25 }, { afterDays: 730, dropPercent: 45 }] },
  "bracelets":       { ref: "jewelry" },
  "necklaces":       { ref: "jewelry" },
  "rings":           { ref: "jewelry" },
  "earrings":        { ref: "jewelry" },

  // ═══════════════════════════════════════════════════════════
  //  ⚽ SPORTS / FITNESS
  //  Source: ClaimsPages "Hobbies and Sporting Goods"
  // ═══════════════════════════════════════════════════════════

  sports: { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 10 }, { afterDays: 180, dropPercent: 20 }, { afterDays: 365, dropPercent: 35 }, { afterDays: 730, dropPercent: 50 }, { afterDays: 1095, dropPercent: 65 }] },
  fitness:          { ref: "sports" },
  outdoors:         { ref: "sports" },
  "sporting goods": { ref: "sports" },

  "cricket equipment":  { ref: "sports" },
  "football equipment": { ref: "sports" },
  "basketball equipment":{ ref: "sports" },
  "tennis equipment":   { ref: "sports" },
  "badminton equipment":{ ref: "sports" },
  "swimming gear":      { ref: "sports" },
  "cycling":            { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 8 }, { afterDays: 180, dropPercent: 18 }, { afterDays: 365, dropPercent: 32 }, { afterDays: 730, dropPercent: 48 }, { afterDays: 1095, dropPercent: 62 }] },
  "bicycles":           { ref: "cycling" },
  "gym equipment":      { startAfterDays: 90, stages: [{ afterDays: 90, dropPercent: 8 }, { afterDays: 365, dropPercent: 20 }, { afterDays: 730, dropPercent: 35 }, { afterDays: 1825, dropPercent: 55 }] },
  "treadmills":         { ref: "gym equipment" },
  "yoga":               { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 10 }, { afterDays: 180, dropPercent: 25 }, { afterDays: 365, dropPercent: 45 }, { afterDays: 730, dropPercent: 60 }] },
  "yoga mats":          { ref: "yoga" },
  "sports shoes":       { startAfterDays: 45, stages: [{ afterDays: 45, dropPercent: 12 }, { afterDays: 90, dropPercent: 28 }, { afterDays: 180, dropPercent: 48 }, { afterDays: 365, dropPercent: 65 }] },
  "sports clothing":    { ref: "sportswear" },
  "camping":            { ref: "outdoors" },
  "hiking":             { ref: "outdoors" },
  "fishing":            { ref: "sports" },
  "boxing":             { ref: "sports" },
  "martial arts":       { ref: "sports" },
  "skateboarding":      { ref: "sports" },
  "skiing":             { ref: "sports" },

  // ═══════════════════════════════════════════════════════════
  //  🧸 TOYS / GAMES
  //  Source: ClaimsPages "Toys and Games"
  // ═══════════════════════════════════════════════════════════

  toys: { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 15 }, { afterDays: 90, dropPercent: 30 }, { afterDays: 180, dropPercent: 45 }, { afterDays: 365, dropPercent: 60 }, { afterDays: 730, dropPercent: 70 }] },
  games: { ref: "toys" },
  kids:  { ref: "kids clothing" },

  "board games":        { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 10 }, { afterDays: 90, dropPercent: 25 }, { afterDays: 180, dropPercent: 40 }, { afterDays: 365, dropPercent: 55 }] },
  "video games":        { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 15 }, { afterDays: 90, dropPercent: 30 }, { afterDays: 180, dropPercent: 45 }, { afterDays: 365, dropPercent: 60 }] },
  "educational toys":   { startAfterDays: 45, stages: [{ afterDays: 45, dropPercent: 10 }, { afterDays: 180, dropPercent: 28 }, { afterDays: 365, dropPercent: 48 }, { afterDays: 730, dropPercent: 65 }] },
  "dolls":              { ref: "toys" },
  "lego":               { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 10 }, { afterDays: 180, dropPercent: 25 }, { afterDays: 365, dropPercent: 40 }, { afterDays: 730, dropPercent: 55 }] },
  "building blocks":    { ref: "lego" },
  "remote control toys":{ ref: "toys" },
  "outdoor toys":       { ref: "toys" },
  "puzzles":            { ref: "board games" },
  "stuffed animals":    { ref: "toys" },
  "baby toys":          { startAfterDays: 15, stages: [{ afterDays: 15, dropPercent: 20 }, { afterDays: 45, dropPercent: 45 }, { afterDays: 90, dropPercent: 65 }] },
  "toy cars":           { ref: "toys" },
  "card games":         { ref: "board games" },
  "party games":        { ref: "board games" },

  // ═══════════════════════════════════════════════════════════
  //  📚 BOOKS / MEDIA
  //  Source: ClaimsPages "Books"
  // ═══════════════════════════════════════════════════════════

  books: { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 180, dropPercent: 40 }, { afterDays: 365, dropPercent: 55 }, { afterDays: 730, dropPercent: 65 }] },
  media:  { ref: "books" },

  "fiction books":      { ref: "books" },
  "non-fiction books":  { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 15 }, { afterDays: 180, dropPercent: 35 }, { afterDays: 365, dropPercent: 50 }, { afterDays: 730, dropPercent: 65 }] },
  "textbooks":          { startAfterDays: 90, stages: [{ afterDays: 90, dropPercent: 15 }, { afterDays: 180, dropPercent: 30 }, { afterDays: 365, dropPercent: 50 }, { afterDays: 730, dropPercent: 65 }] },
  "children's books":   { ref: "books" },
  "comics":             { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 90, dropPercent: 40 }, { afterDays: 180, dropPercent: 55 }, { afterDays: 365, dropPercent: 65 }] },
  "magazines":          { startAfterDays: 7, stages: [{ afterDays: 7, dropPercent: 30 }, { afterDays: 30, dropPercent: 60 }, { afterDays: 90, dropPercent: 80 }] },
  "music cds":          { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 90, dropPercent: 40 }, { afterDays: 180, dropPercent: 55 }, { afterDays: 365, dropPercent: 65 }] },
  "dvds":               { ref: "music cds" },
  "vinyl records":      { startAfterDays: 180, appreciation: true, stages: [{ afterDays: 180, gainPercent: 3 }, { afterDays: 365, gainPercent: 8 }, { afterDays: 730, gainPercent: 15 }, { afterDays: 1825, gainPercent: 30 }] },
  "music":              { ref: "music cds" },
  "movies":             { ref: "music cds" },

  // ═══════════════════════════════════════════════════════════
  //  💄 COSMETICS / BEAUTY
  //  Source: Product expiry standard
  // ═══════════════════════════════════════════════════════════

  cosmetics: { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 20 }, { afterDays: 90, dropPercent: 40 }, { afterDays: 180, dropPercent: 60 }, { afterDays: 270, dropPercent: 75 }] },
  beauty:   { ref: "cosmetics" },
  skincare: { ref: "cosmetics" },

  "makeup":             { ref: "cosmetics" },
  "foundation":         { ref: "cosmetics" },
  "lipstick":           { ref: "cosmetics" },
  "skincare products":  { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 15 }, { afterDays: 90, dropPercent: 35 }, { afterDays: 180, dropPercent: 55 }, { afterDays: 270, dropPercent: 70 }] },
  "moisturizers":       { ref: "skincare products" },
  "serums":             { ref: "skincare products" },
  "sunscreen":          { ref: "cosmetics" },
  "hair care":          { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 15 }, { afterDays: 90, dropPercent: 35 }, { afterDays: 180, dropPercent: 55 }, { afterDays: 270, dropPercent: 70 }] },
  "shampoo":            { ref: "hair care" },
  "conditioner":        { ref: "hair care" },
  "perfumes":           { startAfterDays: 60, stages: [{ afterDays: 60, dropPercent: 10 }, { afterDays: 180, dropPercent: 28 }, { afterDays: 365, dropPercent: 48 }, { afterDays: 730, dropPercent: 65 }] },
  "fragrances":         { ref: "perfumes" },
  "nail care":          { ref: "cosmetics" },
  "body care":          { ref: "skincare products" },
  "men's grooming":     { ref: "hair care" },
  "personal care":      { ref: "cosmetics" },
  "oral care":          { ref: "cosmetics" },
  "deodorants":         { ref: "cosmetics" },

  // ═══════════════════════════════════════════════════════════
  //  🍎 FOOD / GROCERY
  //  Source: Perishable goods standard
  // ═══════════════════════════════════════════════════════════

  food: { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 7, dropPercent: 20 }, { afterDays: 14, dropPercent: 40 }, { afterDays: 30, dropPercent: 65 }, { afterDays: 60, dropPercent: 80 }] },
  grocery:     { ref: "food" },
  perishables: { ref: "food" },

  "fresh produce":  { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 3, dropPercent: 25 }, { afterDays: 7, dropPercent: 55 }, { afterDays: 14, dropPercent: 80 }] },
  "vegetables":     { ref: "fresh produce" },
  "fruits":         { ref: "fresh produce" },
  "dairy":          { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 5, dropPercent: 30 }, { afterDays: 10, dropPercent: 60 }, { afterDays: 20, dropPercent: 80 }] },
  "meat":           { ref: "dairy" },
  "seafood":        { ref: "dairy" },
  "bakery":         { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 2, dropPercent: 30 }, { afterDays: 5, dropPercent: 65 }, { afterDays: 10, dropPercent: 85 }] },
  "bread":          { ref: "bakery" },
  "beverages":      { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 30, dropPercent: 10 }, { afterDays: 90, dropPercent: 25 }, { afterDays: 180, dropPercent: 50 }] },
  "snacks":         { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 14, dropPercent: 15 }, { afterDays: 30, dropPercent: 35 }, { afterDays: 60, dropPercent: 60 }] },
  "packaged foods": { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 30, dropPercent: 10 }, { afterDays: 90, dropPercent: 30 }, { afterDays: 180, dropPercent: 55 }] },
  "spices":         { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 10 }, { afterDays: 180, dropPercent: 25 }, { afterDays: 365, dropPercent: 50 }] },
  "frozen foods":   { ref: "packaged foods" },
  "organic food":   { ref: "fresh produce" },

  // ═══════════════════════════════════════════════════════════
  //  🔧 TOOLS / HARDWARE
  //  Source: IRS 5-7 year durable goods
  // ═══════════════════════════════════════════════════════════

  tools: { startAfterDays: 90, stages: [{ afterDays: 90, dropPercent: 5 }, { afterDays: 365, dropPercent: 15 }, { afterDays: 730, dropPercent: 30 }, { afterDays: 1825, dropPercent: 50 }] },
  hardware:  { ref: "tools" },
  equipment: { ref: "tools" },

  "hand tools":       { ref: "tools" },
  "power tools":      { startAfterDays: 90, stages: [{ afterDays: 90, dropPercent: 8 }, { afterDays: 365, dropPercent: 20 }, { afterDays: 730, dropPercent: 35 }, { afterDays: 1825, dropPercent: 55 }] },
  "drills":           { ref: "power tools" },
  "saws":             { ref: "power tools" },
  "construction":     { ref: "tools" },
  "electrical":       { ref: "tools" },
  "plumbing":         { ref: "tools" },
  "safety equipment": { ref: "tools" },
  "measuring tools":  { ref: "tools" },
  "storage":          { ref: "tools" },

  // ═══════════════════════════════════════════════════════════
  //  🚗 AUTOMOTIVE
  //  Source: IRS 5-year vehicle depreciation
  // ═══════════════════════════════════════════════════════════

  automotive: { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 365, dropPercent: 20 }, { afterDays: 730, dropPercent: 35 }, { afterDays: 1095, dropPercent: 50 }, { afterDays: 1825, dropPercent: 65 }] },
  vehicles: { ref: "automotive" },
  cars:     { ref: "automotive" },
  auto:     { ref: "automotive" },

  "car accessories":    { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 10 }, { afterDays: 180, dropPercent: 25 }, { afterDays: 365, dropPercent: 40 }, { afterDays: 730, dropPercent: 58 }] },
  "car parts":          { ref: "car accessories" },
  "tires":              { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 365, dropPercent: 15 }, { afterDays: 730, dropPercent: 30 }, { afterDays: 1095, dropPercent: 50 }] },
  "car electronics":    { ref: "electronics" },
  "motorcycles":        { ref: "automotive" },
  "scooters":           { ref: "automotive" },
  "car batteries":      { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 180, dropPercent: 15 }, { afterDays: 365, dropPercent: 30 }, { afterDays: 730, dropPercent: 55 }] },
  "motor oil":          { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 90, dropPercent: 10 }, { afterDays: 180, dropPercent: 25 }, { afterDays: 365, dropPercent: 50 }] },

  // ═══════════════════════════════════════════════════════════
  //  🏥 HEALTH / MEDICAL
  // ═══════════════════════════════════════════════════════════

  health: { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 30, dropPercent: 10 }, { afterDays: 90, dropPercent: 25 }, { afterDays: 180, dropPercent: 45 }, { afterDays: 365, dropPercent: 65 }] },
  medical:    { ref: "health" },
  healthcare: { ref: "health" },

  "vitamins":           { ref: "health" },
  "supplements":        { ref: "health" },
  "medical devices":    { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 180, dropPercent: 10 }, { afterDays: 365, dropPercent: 22 }, { afterDays: 730, dropPercent: 38 }, { afterDays: 1825, dropPercent: 55 }] },
  "first aid":          { ref: "health" },
  "fitness equipment":  { ref: "gym equipment" },
  "medicines":          { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 30, dropPercent: 15 }, { afterDays: 90, dropPercent: 40 }, { afterDays: 180, dropPercent: 70 }] },
  "baby care":          { ref: "health" },
  "eye care":           { ref: "health" },
  "dental care":        { ref: "health" },

  // ═══════════════════════════════════════════════════════════
  //  🎵 MUSICAL INSTRUMENTS
  // ═══════════════════════════════════════════════════════════

  "musical instruments": { startAfterDays: 180, stages: [{ afterDays: 180, dropPercent: 5 }, { afterDays: 365, dropPercent: 12 }, { afterDays: 730, dropPercent: 22 }, { afterDays: 1825, dropPercent: 40 }] },
  "guitars":             { ref: "musical instruments" },
  "keyboards":           { ref: "musical instruments" },
  "drums":               { ref: "musical instruments" },
  "violins":             { ref: "musical instruments" },
  "flutes":              { ref: "musical instruments" },
  "microphones":         { ref: "musical instruments" },
  "music accessories":   { ref: "musical instruments" },

  // ═══════════════════════════════════════════════════════════
  //  🐾 PET SUPPLIES
  // ═══════════════════════════════════════════════════════════

  "pet supplies": { startAfterDays: 30, stages: [{ afterDays: 30, dropPercent: 10 }, { afterDays: 90, dropPercent: 25 }, { afterDays: 180, dropPercent: 45 }, { afterDays: 365, dropPercent: 60 }] },
  pets: { ref: "pet supplies" },

  "pet food":        { startAfterDays: 0, stages: [{ afterDays: 0, dropPercent: 0 }, { afterDays: 14, dropPercent: 15 }, { afterDays: 30, dropPercent: 35 }, { afterDays: 60, dropPercent: 60 }] },
  "pet accessories": { ref: "pet supplies" },
  "pet toys":        { ref: "toys" },
  "pet clothing":    { ref: "clothes" },
  "aquarium":        { ref: "pet supplies" },

  // ═══════════════════════════════════════════════════════════
  //  📦 DEFAULT — unknown category
  //  Conservative moderate depreciation
  // ═══════════════════════════════════════════════════════════

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