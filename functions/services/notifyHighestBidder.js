const { db } = require("../firebaseAdmin");
const { sendWinnerEmail } = require("../config/node_mailer/mailer");

const watchAuctionStatus = () => {
//   console.log("👂 Watching auctions for status changes...");

  db.collection("products").onSnapshot(
    (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        console.log(
          `🔄 type: ${change.type} | name: ${change.doc.data().name}`,
        );

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

        console.log(
          `🔔 Auction ended! Finding winner: ${auction.highestBidderId}`,
        );

        try {
          const usersSnapshot = await db
            .collection("users")
            .where("uid", "==", auction.highestBidderId)
            .limit(1)
            .get();

          if (usersSnapshot.empty) {
            console.log(
              `❌ No user found with uid: ${auction.highestBidderId}`,
            );
            return;
          }

          const user = usersSnapshot.docs[0].data();
          console.log(`📧 Found user: ${user.fullName} → ${user.email}`);

          // ✅ Set payment deadline = now + 24 hours
          const paymentDeadline = new Date();
          paymentDeadline.setHours(paymentDeadline.getHours() + 24);

          // ✅ Mark as notified + set deadline BEFORE sending email
          //    (prevents duplicate if email send crashes midway)
          await change.doc.ref.update({
            "auction.winnerNotified": true,
            "auction.winnerId": auction.highestBidderId,
            "auction.paymentDeadline": paymentDeadline,
            "auction.paymentStatus": "pending",
          });

          // ✅ Send winner email with deadline
          await sendWinnerEmail(
            user.email,
            user.fullName,
            product.name,
            auction.highestBid,
            product,
            paymentDeadline, change.doc.id,
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
      console.error("❌ Snapshot listener error:", error);
    },
  );
};

// ✅ Auto-disable purchase after 24 hours
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

      // ✅ Only expire if payment is still pending (not already paid)
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
      console.error(
        `❌ Failed to expire payment for ${productName}:`,
        err.message,
      );
    }
  }, timeUntilExpiry);
};

module.exports = { watchAuctionStatus };
