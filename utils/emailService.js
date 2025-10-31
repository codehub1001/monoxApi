const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: false, // use STARTTLS, not SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

async function sendMail({ to, subject, html }) {
  console.log(`📬 Sending email to ${to}...`);
  try {
    const info = await transporter.sendMail({
      from: `"Monox Trades" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email: ${error.message}`);
  }
}

module.exports = { sendMail };
