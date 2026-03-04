const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ New Auction Winner function
const sendWinnerEmail = async (
  email,
  userName,
  productName,
  highestBid,
  product,
  paymentDeadline,
  productId, // ✅ new param
) => {
  try {
    const productImage =
      product.images?.find((img) => img.isMain)?.url ||
      product.images?.[0]?.url ||
      "";

    const mailOptions = {
      from: `"Deadstock Auctions" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎉 Congratulations! You won the auction for ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          
          <div style="background-color: #366a48; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">🎉 You Won!</h1>
          </div>

          <div style="padding: 20px;">
            <p style="font-size: 16px;">Hello <strong>${userName}</strong>,</p>
            <p>Congratulations! You are the highest bidder and have won the auction for:</p>

            <div style="background: #f9f9f9; border-radius: 8px; padding: 15px; margin: 20px 0;">
              ${productImage ? `<img src="${productImage}" alt="${productName}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; float: left; margin-right: 12px;" />` : ""}
              <div>
                <h2 style="margin: 0 0 8px 0; color: #2c3e50;">${productName}</h2>
                <p style="margin: 0; color: #7f8c8d;">${product.description}</p>
              </div>
              <div style="clear:both"></div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #f2f2f2;">
                <td style="padding: 10px; font-weight: bold;">Your Winning Bid</td>
                <td style="padding: 10px; color: #e74c3c; font-size: 20px; font-weight: bold;">Rs. ${highestBid}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold;">Product</td>
                <td style="padding: 10px;">${productName}</td>
              </tr>
            </table>

            <!-- CTA with productId ✅ -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/auctionCheckout/${productId}" 
                style="background-color: #366a48; color: white; padding: 12px 30px; 
                       border-radius: 5px; text-decoration: none; font-size: 16px;">
                Complete Your Purchase
              </a>
            </div>

            <p style="color: #e74c3c; font-weight: bold;">⚠️ Please complete your payment within 24 hours to secure your item.</p>
          </div>

          <div style="background: #f2f2f2; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 12px; color: #7f8c8d;">
              This is an automated email. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending winner email:", error);
    throw error;
  }
};
// Temporary test — delete after confirming it works
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("❌ Transporter error:", error.message);
//   } else {
//     console.log("✅ Gmail connected successfully! Ready to send emails.");
//   }
// });
module.exports = { sendWinnerEmail };
