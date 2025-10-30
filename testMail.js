const sendEmail = require("./utils/emailService");

(async () => {
  await sendEmail({
    to: "oluwachukkie@gmail.com",
    subject: "Test Email from Monox Trades",
    html: "<h2>Hello from Monox Trades!</h2><p>If you see this, your mail setup works ✅</p>",
  });
})();
