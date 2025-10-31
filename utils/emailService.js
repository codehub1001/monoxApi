const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT), // 465 for SSL, 587 for STARTTLS
  secure: process.env.MAIL_PORT == 465,  // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // needed if self-signed certs
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Monox Trades" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to} | Subject: ${subject} | Response: ${info.response}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to} | Subject: ${subject}`);
    console.error(err.stack);
    throw err;
  }
};

module.exports = sendEmail;
