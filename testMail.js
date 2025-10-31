require('dotenv').config();
const { sendMail } = require('./utils/emailService'); // ✅ use sendMail, not sendEmail

(async () => {
  try {
    await sendMail({
      to: 'oluwachukkie@gmail.com',
      subject: 'Test Email from Monox Trades',
      html: `<h2>Hello 👋</h2><p>This is a test email sent using your SMTP setup.</p>`,
    });
    console.log('✅ Test email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
  }
})();
