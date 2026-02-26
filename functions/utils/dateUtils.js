// utils/dateUtils.js

/**
 * Returns number of full days between two Date objects.
 * Always returns a non-negative integer.
 */
function daysBetween(start, end) {
  if (!start || !end) return 0;
  const diff = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Safely converts a Firestore Timestamp OR a Date OR a string to a JS Date.
 * This is critical — Firestore returns Timestamp objects, not plain Dates.
 */
function toDate(value) {
  if (!value) return null;
  if (value && typeof value.toDate === "function") return value.toDate(); // Firestore Timestamp
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  return null;
}

module.exports = { daysBetween, toDate };