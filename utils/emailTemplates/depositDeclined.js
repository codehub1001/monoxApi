const depositDeclinedEmail = ({ username, amount, currency, date, reason }) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #E74C3C;">Deposit Declined ❌</h2>
    <p>Hi ${username},</p>
    <p>Your deposit of <strong>${amount} Usd</strong> on ${date} was declined.</p>
    <p>Reason: ${reason || "Not specified"}</p>
    <p>Please contact support if you need assistance.</p>
    <hr />
    <p style="font-size: 12px; color: #888;">Monox Trades Team</p>
  </div>
`;

module.exports = depositDeclinedEmail;
