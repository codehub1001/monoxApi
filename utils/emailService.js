const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "deliveryex.express",     // ✅ SMTP server
  port: 465,                      // ✅ SSL port
  secure: true,                   // ✅ must be true for port 465
  auth: {
    user: "monox@deliveryex.express",  // ✅ full email address
    pass: process.env.MAIL_PASS,       // ✅ your email password
  },
  tls: {
    rejectUnauthorized: false,    // allows self-signed certificates
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Transporter connection failed:", err);
  } else {
    console.log("✅ Transporter ready to send emails");
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Monox Trades" <monox@deliveryex.express>`,
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
