const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // e.g. mail.monoxtrades.com
  port: parseInt(process.env.MAIL_PORT) || 465,
  secure: true, // true for SSL/TLS (port 465)
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  logger: true,
  debug: true,
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Monox Trades" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    };

    console.log(`📬 Sending email to ${to}...`);
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}: ${error.message}`);
  }
};

module.exports = { sendMail };
