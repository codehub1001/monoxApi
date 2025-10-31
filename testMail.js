// testMail.js
const { sendMail } = require("./utils/emailService"); // ✅ destructure here

(async () => {
  try {
    await sendMail({
      to: "oluwachukkie@gmail.com",
      subject: "Test Email from Monox Trades",
      html: `
        <h2>Hello from Monox Trades!</h2>
        <p>If you see this, your mail setup works ✅</p>
      `,
    });
    console.log("Test email sent successfully!");
  } catch (error) {
    console.error("Failed to send test email:", error.message);
  }
})();
