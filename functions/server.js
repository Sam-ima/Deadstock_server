require("./firebaseAdmin");

const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/payment", require("./routes/orderPaymentRoutes"));

// health check
app.get("/", (req, res) => {
  res.send("Backend server running 🚀");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
