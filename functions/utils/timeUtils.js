// server/utils/timeUtils.js

/**
 * Calculate number of full days between two dates
 * @param {Date} start
 * @param {Date} end
 * @returns {number}
 */
function daysElapsed(start, end) {
  const msInDay = 1000 * 60 * 60 * 24;
  return Math.floor((end - start) / msInDay);
}

module.exports = { daysElapsed };
