const nodemailer = require("nodemailer");

// ✅ Create transporter for cPanel / custom mail host
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // e.g. smtp.deliveryex.express
  port: Number(process.env.MAIL_PORT) || 465, // 465 = SSL, 587 = TLS
  secure: Number(process.env.MAIL_PORT) === 465, // true for SSL
  auth: {
    user: process.env.MAIL_USER, // e.g. monox@deliveryex.express
    pass: process.env.MAIL_PASS, // your cPanel password
  },
  tls: {
    rejectUnauthorized: false, // avoids certificate handshake issues
  },
});

// ✅ Helper function to send emails
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Monox Trades" <${process.env.MAIL_USER}>`, // must match authorized sender
      to, // recipient email
      subject, // email subject
      html, // HTML email content (your template)
    });

    console.log("✅ Email sent successfully:", info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
