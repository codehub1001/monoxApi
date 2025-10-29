const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get wallet
exports.getWallet = async (req, res) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
    });

    if (!wallet) {
      // Auto-create wallet if missing
      const newWallet = await prisma.wallet.create({ data: { userId: req.user.id, balance: 0 } });
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

    // Create a pending transaction only
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: "deposit",
        amount: parseFloat(amount),
        status: "pending", // pending until admin approves
      },
    });

    res.status(201).json({
      success: true,
      message: "Deposit request submitted and is pending admin approval.",
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

    const wallet = await prisma.wallet.findUnique({ where: { userId: req.user.id } });
    if (!wallet || wallet.balance < amount) 
      return res.status(400).json({ error: "Insufficient balance" });

    // Create a pending withdrawal transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: "withdraw",
        amount: parseFloat(amount),
        status: "pending", // pending until admin approves
      },
    });

    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted and is pending admin approval.",
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
