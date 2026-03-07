const { db } = require("../firebaseAdmin");
const { sendWinnerEmail } = require("../config/node_mailer/mailer");

let unsubscribe = null;
let retryCount = 0;
let retryTimeout = null;
const MAX_RETRY_DELAY_MS = 30000; // cap at 30 seconds

const watchAuctionStatus = () => {
  // Clear any existing listener before starting a new one
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  console.log(`👂 Watching auctions for status changes... (attempt ${retryCount + 1})`);

  unsubscribe = db.collection("products").onSnapshot(
    (snapshot) => {
      // ✅ Reset retry count on successful connection
      retryCount = 0;

      snapshot.docChanges().forEach(async (change) => {
        console.log(`🔄 type: ${change.type} | name: ${change.doc.data().name}`);

        if (change.type !== "modified") return;

        const product = change.doc.data();
        const auction = product.auction;

        // ✅ Only process ended auctions
        if (auction?.status !== "ended") return;

        // ✅ Skip if already notified (prevents duplicate emails)
        if (auction?.winnerNotified === true) {
          console.log(`⏭️ Already notified for: ${product.name}`);
          return;
        }

        if (!auction?.highestBidderId) {
          console.log(`⏭️ No highestBidderId for: ${product.name}`);
          return;
        }

        console.log(`🔔 Auction ended! Finding winner: ${auction.highestBidderId}`);

        try {
          const usersSnapshot = await db
            .collection("users")
            .where("uid", "==", auction.highestBidderId)
            .limit(1)
            .get();

          if (usersSnapshot.empty) {
            console.log(`❌ No user found with uid: ${auction.highestBidderId}`);
            return;
          }

          const user = usersSnapshot.docs[0].data();
          console.log(`📧 Found user: ${user.fullName} → ${user.email}`);

          // ✅ Set payment deadline = now + 24 hours
          const paymentDeadline = new Date();
          paymentDeadline.setHours(paymentDeadline.getHours() + 24);

          // ✅ Mark as notified BEFORE sending email to prevent duplicates
          await change.doc.ref.update({
            "auction.winnerNotified": true,
            "auction.winnerId": auction.highestBidderId,
            "auction.paymentDeadline": paymentDeadline,
            "auction.paymentStatus": "pending",
          });

          // ✅ Send winner email
          await sendWinnerEmail(
            user.email,
            user.fullName,
            product.name,
            auction.highestBid,
            product,
            paymentDeadline,
            change.doc.id,
          );

          console.log(`✅ Winner email sent to ${user.email}`);
          console.log(`⏰ Payment deadline set: ${paymentDeadline}`);

          // ✅ Schedule auto-disable after 24 hours
          schedulePaymentExpiry(change.doc.ref, paymentDeadline, product.name);
        } catch (err) {
          console.error(`❌ Failed to notify winner:`, err.message);
        }
      });
    },
    (error) => {
      // ❌ Listener failed — clean up and schedule reconnect
      console.error("❌ Snapshot listener error:", error.message);

      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }

      // Exponential backoff: 2s, 4s, 8s, 16s... capped at 30s
      retryCount++;
      const delay = Math.min(1000 * 2 ** retryCount, MAX_RETRY_DELAY_MS);
      console.log(`🔄 Reconnecting in ${delay / 1000}s... (retry #${retryCount})`);

      retryTimeout = setTimeout(() => {
        watchAuctionStatus();
      }, delay);
    },
  );
};

// ✅ Auto-disable purchase after 24 hours if payment not completed
const schedulePaymentExpiry = (docRef, paymentDeadline, productName) => {
  const now = new Date();
  const timeUntilExpiry = paymentDeadline.getTime() - now.getTime();

  console.log(
    `⏰ Payment expiry scheduled in ${Math.round(timeUntilExpiry / 1000 / 60)} minutes for: ${productName}`,
  );

  setTimeout(async () => {
    try {
      const docSnap = await docRef.get();
      const data = docSnap.data();

      if (data?.auction?.paymentStatus === "pending") {
        await docRef.update({
          "auction.paymentStatus": "expired",
          "auction.purchaseEnabled": false,
        });
        console.log(`🚫 Payment deadline expired for: ${productName}`);
      } else {
        console.log(`✅ Payment already completed for: ${productName}`);
      }
    } catch (err) {
      console.error(`❌ Failed to expire payment for ${productName}:`, err.message);
    }
  }, timeUntilExpiry);
};

// ✅ Clean up listener on server shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received — cleaning up auction watcher...");
  if (unsubscribe) unsubscribe();
  if (retryTimeout) clearTimeout(retryTimeout);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received — cleaning up auction watcher...");
  if (unsubscribe) unsubscribe();
  if (retryTimeout) clearTimeout(retryTimeout);
  process.exit(0);
});

module.exports = { watchAuctionStatus };