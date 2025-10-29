function generateReferralCode(username) {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${username.slice(0, 3).toUpperCase()}-${random}`;
}

module.exports = generateReferralCode;
