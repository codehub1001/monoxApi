module.exports = ({ username, type, amount, date }) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color:#2e7d32;">New ${type} Request</h2>
    <p>A new <strong>${type.toLowerCase()}</strong> request has been made on MonoxTrades.</p>
    <ul style="line-height:1.8;">
      <li><strong>User:</strong> ${username}</li>
      <li><strong>Amount:</strong> $${amount}</li>
      <li><strong>Date:</strong> ${new Date(date).toLocaleString()}</li>
    </ul>
    <p>Please log in to the Admin Dashboard to review and take action.</p>
    <hr/>
    <p style="font-size:12px;color:#777;">MonoxTrades Automated Notification</p>
  </div>
`;
