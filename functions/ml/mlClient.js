const axios = require("axios");
const { ML_API_URL } = require("../config/mlConfig");

if (!ML_API_URL) throw new Error("ML_API_URL not set");

async function callMLModel(payload) {
  // Ensure required fields have default values
  const safePayload = {
    product_id: payload.product_id || "unknown",
    category: payload.category || "general",
    subcategory: payload.subcategory || null,
    brand: payload.brand || null,
    original_price: payload.original_price ?? 0,
    current_price: payload.current_price ?? 0,
    floor_price: payload.floor_price ?? 0,
    age_days: payload.age_days ?? 0,
    season: payload.season || null
  };

  try {
    const response = await axios.post(`${ML_API_URL}/predict-price`, safePayload, {
      timeout: 10000
    });
    return response.data; // expects { new_price, age_days }
  } catch (error) {
    console.error("ML call failed:", error.response?.data || error.message);
    // fallback: return current price if ML fails
    return { new_price: safePayload.current_price, age_days: safePayload.age_days };
  }
}

module.exports = { callMLModel };