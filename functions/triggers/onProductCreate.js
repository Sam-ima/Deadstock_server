// backend/functions/triggers/onProductCreate.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const initPrice = require('./pricing/initPrice');

exports.onProductCreate = functions.firestore
  .document('products/{productId}')
  .onCreate(async (snap, context) => {
    const productId = context.params.productId;
    const data = snap.data();
    
    // Initialize pricing fields
    const initData = {
      ...data,
      currentPrice: data.originalPrice,
      listDate: admin.firestore.FieldValue.serverTimestamp(),
      lastAdjusted: admin.firestore.FieldValue.serverTimestamp(),
      adjustmentHistory: [],
      priceStatus: 'active',
      floorPrice: data.originalPrice * 0.3
    };
    
    await snap.ref.set(initData, { merge: true });
    await initPrice.initProductPrice(productId);
  });
