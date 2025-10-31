const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,          // deliveryex.express
  port: parseInt(process.env.MAIL_PORT),// 465
  secure: true,                         // SSL for port 465
  auth: {
    user: process.env.MAIL_USER,        // full email address
    pass: process.env.MAIL_PASS,        // email password
  },
  tls: { rejectUnauthorized: false },   // allow self-signed certs
  logger: true,
  debug: true,
});

// Verify transporter connection on startup
transporter.verify((err, success) => {
  if (err) console.error("❌ Transporter connection failed:", err);
  else console.log("✅ Transporter ready to send emails");
});

// Main email sender function
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Monox Trades" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to} | MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;
