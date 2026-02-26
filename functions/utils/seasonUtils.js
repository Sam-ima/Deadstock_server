// utils/seasonUtils.js
// Seasons based on Nepal calendar

function currentSeason() {
  const m = new Date().getMonth() + 1; // 1–12
  if (m >= 3 && m <= 5) return "summer";
  if (m >= 6 && m <= 8) return "monsoon";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

module.exports = { currentSeason };