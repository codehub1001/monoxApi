require("dotenv").config(); // Load .env

const testRegister = async () => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Chuka",
        lastName: "Okoli",
        username: "chuka123",
        email: "oluwachukki@gmail.com", // change to a test email
        mobile: "08123456789",
        country: "Nigeria",
        password: "Password123!",
        confirmPassword: "Password123!",
      }),
    });

    const data = await response.json();
    console.log("✅ Response:", data);
  } catch (err) {
    console.error("❌ Request failed:", err.message);
  }
};

testRegister();
