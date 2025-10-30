const welcomeTemplate = (firstName, referralCode) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Monox Trades</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f3f4f6;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background:#facc15;padding:20px 0;">
              <h1 style="color:#fff;margin:0;">Monox Trades</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:30px;text-align:center;color:#333;">
              <h2 style="color:#facc15;">Welcome, ${firstName}!</h2>
              <p>Thank you for registering on Monox Trades. Your journey to smarter investing starts now.</p>
              <p>Your referral code is:</p>
              <p style="font-size:18px;font-weight:bold;color:#facc15;">${referralCode}</p>
              <a href="https://yourwebsite.com/dashboard" 
                 style="display:inline-block;margin-top:20px;padding:12px 25px;background:#facc15;color:#fff;text-decoration:none;border-radius:5px;">
                 Go to Dashboard
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6;padding:20px;text-align:center;font-size:12px;color:#999;">
              &copy; ${new Date().getFullYear()} Monox Trades. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = welcomeTemplate;
