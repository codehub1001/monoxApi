const nodemailer = require('nodemailer');

const transporter = require('nodemailer').createTransport({
  host: process.env.MAIL_HOST,
  port: 587,            // Use 587 for STARTTLS
  secure: false,        // false for STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    ciphers: 'TLSv1.2',   // enforce TLS 1.2
    rejectUnauthorized: false,
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
    console.log(`✅ Email sent to ${to} | Subject: ${subject}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}: ${error.message}`);
  }
};

module.exports = sendEmail;
