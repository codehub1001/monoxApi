const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const generateReferralCode = require("../utils/generateReferralCode");
const sendEmail = require("../utils/mailer");
const welcomeTemplate = require("../utils/emailTemplates/welcomeTemplate");
const loginTemplate = require("../utils/emailTemplates/loginTemplate");

const prisma = new PrismaClient();

// Register
exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      mobile,
      country,
      password,
      confirmPassword,
      referralCode,
    } = req.body;

    // ✅ Validate required fields
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !mobile ||
      !country ||
      !password ||
      !confirmPassword
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields except referral code are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    // ✅ Check if email or username already exists
    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralCode = generateReferralCode(email);

    // ✅ Create user with wallet
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        mobile,
        country,
        password: hashedPassword,
        referralCode: newReferralCode,
        wallet: {
          create: { balance: 0 },
        },
      },
      include: { wallet: true },
    });

    // ✅ JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Send Welcome Email
    sendEmail({
      to: user.email,
      subject: "Welcome to Monox Trades!",
      html: welcomeTemplate(user.firstName, user.referralCode),
    }).catch((err) => console.error("Welcome email error:", err));

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode,
        wallet: user.wallet,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
      include: { wallet: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isAdmin = user.role === "ADMIN";

    // ✅ Send Login Notification Email
    const loginTime = new Date().toLocaleString();
    sendEmail({
      to: user.email,
      subject: "Login Notification - Monox Trades",
      html: loginTemplate(user.firstName, loginTime, req.ip),
    }).catch((err) => console.error("Login email error:", err));

    res.json({
      success: true,
      message: isAdmin ? "Admin login successful" : "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode,
        wallet: user.wallet,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
