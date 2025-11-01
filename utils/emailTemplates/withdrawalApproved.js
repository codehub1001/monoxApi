const withdrawalApprovedEmail = ({ username, amount, currency, date }) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #2ECC71;">Withdrawal Approved ✅</h2>
    <p>Hi ${username},</p>
    <p>Your withdrawal request of <strong>${amount} Usd</strong> on ${date} has been approved and processed.</p>
    <p>Thank you for using Monox Trades!</p>
    <hr />
    <p style="font-size: 12px; color: #888;">Monox Trades Team</p>
  </div>
`;

module.exports = withdrawalApprovedEmail;
