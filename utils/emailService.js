// utils/emailService.js
require("dotenv").config(); // ✅ Load environment variables first

const Brevo = require("@getbrevo/brevo");
const apiInstance = new Brevo.TransactionalEmailsApi();

// ✅ Inject API key from .env
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

exports.sendMail = async ({ to, subject, html }) => {
  try {
    const email = {
      sender: { name: "Monox Trades", email: "monox@deliveryex.express" }, // Use your verified sender
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    const response = await apiInstance.sendTransacEmail(email);
    console.log(`✅ Email sent via Brevo API to ${to}`, response);
  } catch (error) {
    console.error("❌ Failed to send email:", error.response?.text || error.message);
  }
};
