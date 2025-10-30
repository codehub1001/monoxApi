const nodemailer = require("nodemailer");

// Configure transporter for cPanel email
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,       // e.g., mail.yourdomain.com
  port: Number(process.env.MAIL_PORT) || 465, // 465 for SSL, 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,     // your cPanel email
    pass: process.env.MAIL_PASS,     // email password
  },
});

// Send email function
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
    from: `"Monox Trades" <noreply@deliveryex.express>`
, // Display name users see
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email error:", error);
  }
};

module.exports = sendEmail;
