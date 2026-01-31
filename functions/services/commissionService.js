const { admin, db } = require("../firebaseAdmin");

const COMMISSION_RATE = 0.02; // 2% commission

/**
 * Create commission records for each item in an order
 */
async function createCommissionTransactions(orderId, orderData) {
  try {
    console.log(`Creating commission for order: ${orderId}`);
    
    const batch = db.batch();
    const commissionTxns = [];
    
    // Get all product details
    const productPromises = orderData.items.map(item => 
      db.collection("products").doc(item.productId).get()
    );
    
    const productDocs = await Promise.all(productPromises);
    
    // Create commission record for each product
    orderData.items.forEach((item, index) => {
      const productDoc = productDocs[index];
      if (!productDoc.exists) return;
      
      const product = productDoc.data();
      const subtotal = item.price * item.quantity;
      const commission = subtotal * COMMISSION_RATE;
      const amountToSeller = subtotal - commission;
      
      // Generate commission transaction ID
      const txnId = `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const txnRef = db.collection("commission_transactions").doc(txnId);
      
      const commissionTxn = {
        id: txnId,
        orderId: orderId,
        productId: item.productId,
        itemId: item.productId,
        sellerId: product.sellerId || product.userId,
        productName: item.name || product.name,
        
        // Financial details
        productPrice: item.price,
        quantity: item.quantity,
        subtotal: subtotal,
        commissionRate: COMMISSION_RATE,
        commissionAmount: parseFloat(commission.toFixed(2)),
        amountToSeller: parseFloat(amountToSeller.toFixed(2)),
        
        // Status
        status: "pending",
        paymentStatus: "paid",
        
        // Timestamps
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        settledAt: null,
        
        // References
        buyerId: orderData.userId,
        paymentMethod: orderData.paymentMethod || "esewa",
        paymentRefId: orderData.refId || orderData.transactionUuid
      };
      
      batch.set(txnRef, commissionTxn);
      commissionTxns.push(commissionTxn);
    });
    
    await batch.commit();
    // console.log(`Created ${commissionTxns.length} commission transactions`);
    
    return commissionTxns;
    
  } catch (error) {
    console.error("Error creating commission:", error);
    throw error;
  }
}

/**
 * Get commission summary for an order
 */
async function getOrderCommissionSummary(orderId) {
  const commissionDocs = await db.collection("commission_transactions")
    .where("orderId", "==", orderId)
    .get();
  
  let totalCommission = 0;
  let totalToSellers = 0;
  const sellerBreakdown = {};
  
  commissionDocs.forEach(doc => {
    const txn = doc.data();
    totalCommission += txn.commissionAmount;
    totalToSellers += txn.amountToSeller;
    
    // Group by seller
    const sellerId = txn.sellerId;
    if (!sellerBreakdown[sellerId]) {
      sellerBreakdown[sellerId] = {
        totalAmount: 0,
        commission: 0,
        netAmount: 0,
        items: []
      };
    }
    
    sellerBreakdown[sellerId].totalAmount += txn.subtotal;
    sellerBreakdown[sellerId].commission += txn.commissionAmount;
    sellerBreakdown[sellerId].netAmount += txn.amountToSeller;
    sellerBreakdown[sellerId].items.push({
      productId: txn.productId,
      productName: txn.productName,
      quantity: txn.quantity,
      amount: txn.subtotal
    });
  });
  
  return {
    orderId,
    totalCommission: parseFloat(totalCommission.toFixed(2)),
    totalToSellers: parseFloat(totalToSellers.toFixed(2)),
    sellerBreakdown
  };
}

/**
 * Get seller's pending commission balance
 */
async function getSellerBalance(sellerId) {
  const pendingTxns = await db.collection("commission_transactions")
    .where("sellerId", "==", sellerId)
    .where("status", "==", "pending")
    .get();
  
  let totalPending = 0;
  let transactionCount = 0;
  
  pendingTxns.forEach(doc => {
    const txn = doc.data();
    totalPending += txn.amountToSeller;
    transactionCount++;
  });
  
  return {
    sellerId,
    totalPending: parseFloat(totalPending.toFixed(2)),
    transactionCount
  };
}

module.exports = {
  createCommissionTransactions,
  getOrderCommissionSummary,
  getSellerBalance
};