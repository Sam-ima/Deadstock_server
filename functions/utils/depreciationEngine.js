function calculateDepreciation({ basePrice, createdAt, rule }) {
  const now = new Date();
  const months =
    (now.getFullYear() - createdAt.getFullYear()) * 12 +
    (now.getMonth() - createdAt.getMonth());

  let finalPrice = basePrice;

  switch (rule.type) {
    case "linear":
      finalPrice = basePrice - (basePrice * rule.ratePerMonth / 100) * months;
      break;

    case "seasonal":
      finalPrice = basePrice - (basePrice * rule.initialDrop / 100);
      finalPrice -= (finalPrice * rule.monthlyDrop / 100) * months;
      break;

    case "fixed":
      const years = Math.floor(months / 12);
      finalPrice = basePrice - (basePrice * rule.yearlyDrop / 100) * years;
      break;

    default:
      finalPrice = basePrice;
  }

  return Math.max(finalPrice, 0);
}

module.exports = { calculateDepreciation };
