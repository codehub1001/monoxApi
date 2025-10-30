const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,               // e.g., your SMTP host
  port: parseInt(process.env.MAIL_PORT) || 587, // use 587 or 2525 on Render
  secure: parseInt(process.env.MAIL_PORT) === 465, // SSL only if port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // allows self-signed certs
  },
  logger: true,
  debug: true,
});

// Verify transporter connection
transporter.verify((err, success) => {
  if (err) console.error("❌ Email transporter error:", err);
  else console.log("✅ Email transporter ready to send messages");
});

// Send email function, keeps content intact
const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📬 Sending email to:", to);
    const info = await transporter.sendMail({
      from: `"Monox Trades" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to} | MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email: ${error.message}`);
    throw error; // allows controllers to catch the error
  }
};

module.exports = sendEmail;
