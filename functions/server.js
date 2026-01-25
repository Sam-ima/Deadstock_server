require("./firebaseAdmin"); // Initialize Firebase Admin

const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/payment", require("./routes/orderPaymentRoutes"));
app.use("/api/stock", require("./routes/stockManagementRouter"));

// health check
app.get("/", (req, res) => {
  res.send("Backend server running 🚀");
});

// start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
