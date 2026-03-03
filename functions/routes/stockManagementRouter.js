// routes/stockManagementRouter.js
const express = require("express");
const router = express.Router();
const { reserveStock, finalizeStock } = require("../services/stockManagement");

// POST /api/stock/reserve
router.post("/reserve", reserveStock);

// POST /api/stock/finalize
router.post("/finalize", finalizeStock);

module.exports = router;
