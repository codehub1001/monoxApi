const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendEmail = require("../utils/emailService");
const transactionRequestTemplate = require("../utils/emailTemplates/transactionRequestTemplate");

// Get wallet
exports.getWallet = async (req, res) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
    });

    if (!wallet) {
      const newWallet = await prisma.wallet.create({
        data: { userId: req.user.id, balance: 0 },
      });
      return res.json({ balance: newWallet.balance });
    }

    res.json({ balance: wallet.balance });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({ error: "Server error fetching wallet" });
  }
};

// Deposit request
exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid amount" });

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: "deposit",
        amount: parseFloat(amount),
        status: "pending",
      },
      include: { user: true },
    });

    // ✅ Notify admin via email
    const adminEmail = "admin@monoxtrades.com";
    await sendEmail.sendMail({
      to: adminEmail,
      subject: "🟢 New Deposit Request Pending Approval",
      html: transactionRequestTemplate({
        username: transaction.user.username || transaction.user.email,
        type: "Deposit",
        amount: transaction.amount,
        date: transaction.createdAt,
      }),
    });

    res.status(201).json({
      success: true,
      message: "Deposit request submitted and pending admin approval.",
      transaction,
    });
  } catch (error) {
    console.error("Error in deposit:", error);
    res.status(500).json({ error: "Server error during deposit" });
  }
};

// Withdraw request
exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid amount" });

    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
    });
    if (!wallet || wallet.balance < amount)
      return res.status(400).json({ error: "Insufficient balance" });

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: "withdraw",
        amount: parseFloat(amount),
        status: "pending",
      },
      include: { user: true },
    });

    // ✅ Notify admin via email
    const adminEmail = "admin@monoxtrades.com";
    await sendEmail.sendMail({
      to: adminEmail,
      subject: "🟠 New Withdrawal Request Pending Approval",
      html: transactionRequestTemplate({
        username: transaction.user.username || transaction.user.email,
        type: "Withdrawal",
        amount: transaction.amount,
        date: transaction.createdAt,
      }),
    });

    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted and pending admin approval.",
      transaction,
    });
  } catch (error) {
    console.error("Error in withdraw:", error);
    res.status(500).json({ error: "Server error during withdrawal" });
  }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Server error fetching transactions" });
  }
};
