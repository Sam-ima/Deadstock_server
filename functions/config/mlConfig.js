// Use environment variable or fallback to localhost
const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:8000";

module.exports = { ML_API_URL };