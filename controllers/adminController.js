const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendEmail = require("../utils/emailService");

// Import your email templates
const depositApprovedEmail = require("../utils/emailTemplates/depositApproved");
const depositDeclinedEmail = require("../utils/emailTemplates/depositDeclined");
const withdrawalApprovedEmail = require("../utils/emailTemplates/withdrawalApproved");
const withdrawalDeclinedEmail = require("../utils/emailTemplates/withdrawalDeclined");

// --- Helper to send email and notification ---
const notifyUser = async (io, userId, title, message, type, emailTemplate, emailData, email) => {
  // Socket.IO notification
  io.emit(`notification-${userId}`, {
    title,
    message,
    type,
    timestamp: new Date(),
  });

  // Send email if template exists
  if (emailTemplate && email) {
    try {
      await sendEmail({
        to: email,
        subject: title,
        html: emailTemplate(emailData),
      });
    } catch (err) {
      console.error("Email send error:", err);
    }
  }
};

// --- Users ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { wallet: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- Pending Deposits & Withdrawals ---
exports.getPendingDeposits = async (req, res) => {
  try {
    const deposits = await prisma.transaction.findMany({
      where: {
        AND: [
          { type: { equals: "deposit", mode: "insensitive" } },
          { status: { equals: "pending", mode: "insensitive" } },
        ],
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, deposits });
  } catch (err) {
    console.error("Error fetching deposits:", err);
    res.status(500).json({ success: false, message: "Error fetching deposits" });
  }
};

exports.getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await prisma.transaction.findMany({
      where: {
        AND: [
          { type: { equals: "withdraw", mode: "insensitive" } },
          { status: { equals: "pending", mode: "insensitive" } },
        ],
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, withdrawals });
  } catch (err) {
    console.error("Error fetching withdrawals:", err);
    res.status(500).json({ success: false, message: "Error fetching withdrawals" });
  }
};

// --- Approve/Decline Deposit ---
exports.approveDeposit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const transaction = await prisma.transaction.findUnique({ where: { id }, include: { user: true } });

    if (!transaction || transaction.type.toLowerCase() !== "deposit")
      return res.status(404).json({ success: false, message: "Deposit not found" });

    await prisma.transaction.update({ where: { id }, data: { status: "Success" } });
    await prisma.wallet.update({ where: { userId: transaction.userId }, data: { balance: { increment: transaction.amount } } });

    const io = req.app.get("io");
    await notifyUser(
      io,
      transaction.userId,
      "Deposit Approved",
      `Your deposit of $${transaction.amount} has been approved and credited.`,
      "success",
      depositApprovedEmail,
      { username: transaction.user.username, amount: transaction.amount },
      transaction.user.email
    );

    res.json({ success: true, message: "Deposit approved and wallet credited" });
  } catch (err) {
    console.error("Approve deposit error:", err);
    res.status(500).json({ success: false, message: "Deposit approval failed" });
  }
};

exports.declineDeposit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { status: "Failed" },
      include: { user: true },
    });

    const io = req.app.get("io");
    await notifyUser(
      io,
      transaction.userId,
      "Deposit Declined",
      `Your deposit of $${transaction.amount} was declined.`,
      "error",
      depositDeclinedEmail,
      { username: transaction.user.username, amount: transaction.amount },
      transaction.user.email
    );

    res.json({ success: true, message: "Deposit declined" });
  } catch (err) {
    console.error("Decline deposit error:", err);
    res.status(500).json({ success: false, message: "Failed to decline deposit" });
  }
};

// --- Approve/Decline Withdrawal ---
exports.approveWithdrawal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const transaction = await prisma.transaction.findUnique({ where: { id }, include: { user: true } });

    if (!transaction || transaction.type.toLowerCase() !== "withdraw")
      return res.status(404).json({ success: false, message: "Withdrawal not found" });

    const wallet = await prisma.wallet.findUnique({ where: { userId: transaction.userId } });
    if (wallet.balance < transaction.amount)
      return res.status(400).json({ success: false, message: "Insufficient wallet balance" });

    await prisma.wallet.update({ where: { userId: transaction.userId }, data: { balance: { decrement: transaction.amount } } });
    await prisma.transaction.update({ where: { id }, data: { status: "Success" } });

    const io = req.app.get("io");
    await notifyUser(
      io,
      transaction.userId,
      "Withdrawal Approved",
      `Your withdrawal of $${transaction.amount} has been processed successfully.`,
      "success",
      withdrawalApprovedEmail,
      { username: transaction.user.username, amount: transaction.amount },
      transaction.user.email
    );

    res.json({ success: true, message: "Withdrawal approved and wallet debited" });
  } catch (err) {
    console.error("Approve withdrawal error:", err);
    res.status(500).json({ success: false, message: "Withdrawal approval failed" });
  }
};

exports.declineWithdrawal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { status: "Failed" },
      include: { user: true },
    });

    const io = req.app.get("io");
    await notifyUser(
      io,
      transaction.userId,
      "Withdrawal Declined",
      `Your withdrawal of $${transaction.amount} was declined.`,
      "error",
      withdrawalDeclinedEmail,
      { username: transaction.user.username, amount: transaction.amount },
      transaction.user.email
    );

    res.json({ success: true, message: "Withdrawal declined" });
  } catch (err) {
    console.error("Decline withdrawal error:", err);
    res.status(500).json({ success: false, message: "Failed to decline withdrawal" });
  }
};

// --- Manual Wallet Update ---
exports.updateWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, amount } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ success: false, message: "Invalid amount" });

    const wallet = await prisma.wallet.upsert({
      where: { userId: parseInt(userId) },
      update:
        type === "credit"
          ? { balance: { increment: Number(amount) } }
          : { balance: { decrement: Number(amount) } },
      create: { userId: parseInt(userId), balance: type === "credit" ? Number(amount) : 0 },
    });

    const transaction = await prisma.transaction.create({
      data: {
        userId: parseInt(userId),
        type: type === "credit" ? "Deposit" : "Withdraw",
        amount: Number(amount),
        status: "Success",
      },
    });

    const io = req.app.get("io");
    io.emit(`wallet-update-${userId}`, { balance: wallet.balance });

    // Notify user with appropriate template
    if (type === "credit") {
      await notifyUser(io, userId, "Wallet Credited", `Your wallet has been credited with $${amount}.`, "success", depositApprovedEmail, { username: transaction.userId, amount }, null);
    } else {
      await notifyUser(io, userId, "Wallet Debited", `Your wallet has been debited by $${amount}.`, "warning", withdrawalApprovedEmail, { username: transaction.userId, amount }, null);
    }

    res.json({ success: true, wallet, transaction, message: `Wallet ${type} successful.` });
  } catch (err) {
    console.error("Wallet update error:", err);
    res.status(500).json({ success: false, message: "Wallet update failed" });
  }
};
