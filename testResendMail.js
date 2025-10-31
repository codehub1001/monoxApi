require('dotenv').config();

(async () => {
  const fetch = (await import('node-fetch')).default;

  const sendResendEmail = async ({ to, subject, html }) => {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'monox@deliveryex.express',
          to,
          subject,
          html,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      console.log(`✅ Resend email sent to ${to} | ID: ${data.id}`);
      return data;
    } catch (err) {
      console.error(`❌ Failed to send Resend email to ${to}:`, err.message);
    }
  };

  // --- Test sending ---
  await sendResendEmail({
    to: 'oluwachukkie@gmail.com',
    subject: 'Test Email from Monox Trades via Resend',
    html: `
      <h2>Hello from Monox Trades!</h2>
      <p>If you see this, your Resend email setup works ✅</p>
    `,
  });
})();
