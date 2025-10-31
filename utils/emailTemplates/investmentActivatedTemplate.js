module.exports = (firstName, investment) => {
  return `
  <div style="font-family:Arial, sans-serif; color:#333; padding:20px;">
    <h2 style="color:#2b6cb0;">Investment Activated Successfully 🎉</h2>
    <p>Hi ${firstName || "Investor"},</p>
    <p>Your investment in the <strong>${investment.plan.name}</strong> plan has been successfully activated.</p>
    
    <h4>📊 Investment Details:</h4>
    <ul>
      <li><strong>Amount Invested:</strong> $${investment.investedAmount.toLocaleString()}</li>
      <li><strong>Duration:</strong> ${investment.plan.duration} days</li>
      <li><strong>Start Date:</strong> ${new Date(investment.startDate).toLocaleDateString()}</li>
      <li><strong>End Date:</strong> ${new Date(investment.endDate).toLocaleDateString()}</li>
    </ul>

    <p>We’re excited to have you on board. You can monitor your investment progress in your dashboard anytime.</p>

    <p>Best regards,<br><strong>The Monox Team</strong></p>
  </div>
  `;
};
