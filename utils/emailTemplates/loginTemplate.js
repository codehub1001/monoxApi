const loginTemplate = (firstName, loginTime, ipAddress = "Unknown") => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login Notification</title>
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
              <h2 style="color:#facc15;">Hello, ${firstName}</h2>
              <p>Your account was accessed on:</p>
              <p><strong>${loginTime}</strong></p>
              <p>IP Address: <strong>${ipAddress}</strong></p>
              <p>If this wasn’t you, secure your account immediately.</p>
              <a href="https://yourwebsite.com/login" 
                 style="display:inline-block;margin-top:20px;padding:12px 25px;background:#facc15;color:#fff;text-decoration:none;border-radius:5px;">
                 Secure Account
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

module.exports = loginTemplate;
