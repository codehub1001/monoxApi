const depositApprovedEmail = ({ username, amount, currency, date }) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #2E86C1;">Deposit Approved ✅</h2>
    <p>Hi ${username},</p>
    <p>Your deposit of <strong>${amount} Usd</strong> on ${date} has been approved and credited to your wallet.</p>
    <p>Thank you for choosing Monox Trades!</p>
    <hr />
    <p style="font-size: 12px; color: #888;">Monox Trades Team</p>
  </div>
`;

module.exports = depositApprovedEmail;
