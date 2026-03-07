const { admin, db } = require("../firebaseAdmin");


// ----------------------------
// Reserve Stock (atomic)
// ----------------------------
async function reserveStock(req, res) {
  const { productId, quantity } = req.body;
  // console.log("Reserve request:", productId, quantity);

  const productRef = db.collection("products").doc(productId);

  try {
    await db.runTransaction(async (transaction) => {
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists) throw new Error("Product not found");

      const productData = productDoc.data();

      // Ensure fields exist
      const availableStock = Number(productData.availableStock || 0);
      const reservedStock = Number(productData.reservedStock || 0);

      if (availableStock < quantity)
        throw new Error("Not enough stock available");

      transaction.update(productRef, {
        availableStock: availableStock - quantity,
        reservedStock: reservedStock + quantity,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return res.status(200).json({ success: true, message: "Stock reserved" });
  } catch (err) {
    console.error("ReserveStock error:", err.message);
    return res.status(400).json({ error: err.message });
  }
}

// ----------------------------
// Finalize Stock after payment
// ----------------------------
async function finalizeStock(req, res) {
  const { productId, quantity, paymentStatus } = req.body;

  if (!productId || !quantity || quantity < 1)
    return res.status(400).json({ error: "Invalid input" });

  const productRef = db.collection("products").doc(productId);

  try {
    await db.runTransaction(async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists) throw new Error("Product not found");

      const productData = productDoc.data();
      let updates = {};

      if (paymentStatus === "success") {
        updates = {
          reservedStock: productData.reservedStock - quantity,
          sold: productData.sold + quantity,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
      } else {
        updates = {
          reservedStock: productData.reservedStock - quantity,
          availableStock: productData.availableStock + quantity,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
      }

      transaction.update(productRef, updates);
    });

    return res.status(200).json({ success: true, message: "Stock finalized" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function releaseStock(req, res) {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1)
    return res.status(400).json({ error: "Invalid input" });

  const productRef = db.collection("products").doc(productId);

  try {
    await db.runTransaction(async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists) throw new Error("Product not found");

      const productData = productDoc.data();
      const reservedStock = Number(productData.reservedStock || 0);
      const availableStock = Number(productData.availableStock || 0);

      transaction.update(productRef, {
        reservedStock: Math.max(0, reservedStock - quantity),
        availableStock: availableStock + quantity,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return res.status(200).json({ success: true, message: "Stock released" });
  } catch (err) {
    console.error("ReleaseStock error:", err.message);
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { reserveStock, finalizeStock,releaseStock };
