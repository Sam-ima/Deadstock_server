function daysBetween(start, end) {
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

module.exports = { daysBetween };
