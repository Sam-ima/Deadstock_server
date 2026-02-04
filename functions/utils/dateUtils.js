module.exports.daysBetween = (from, to) => {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
};
