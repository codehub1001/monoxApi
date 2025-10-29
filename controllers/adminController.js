const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ Get all users with wallet info
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

// ✅ Get all pending deposits (case-insensitive)
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

// ✅ Get all pending withdrawals (case-insensitive)
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

// ✅ Approve deposit
exports.approveDeposit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.type.toLowerCase() !== "deposit")
      return res.status(404).json({ success: false, message: "Deposit not found" });

    await prisma.transaction.update({
      where: { id },
      data: { status: "Success" },
    });

    await prisma.wallet.update({
      where: { userId: transaction.userId },
      data: { balance: { increment: transaction.amount } },
    });

    res.json({ success: true, message: "Deposit approved and wallet credited" });
  } catch (err) {
    console.error("Approve deposit error:", err);
    res.status(500).json({ success: false, message: "Deposit approval failed" });
  }
};

// ✅ Decline deposit
exports.declineDeposit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.transaction.update({
      where: { id },
      data: { status: "Failed" },
    });
    res.json({ success: true, message: "Deposit declined" });
  } catch (err) {
    console.error("Decline deposit error:", err);
    res.status(500).json({ success: false, message: "Failed to decline deposit" });
  }
};

// ✅ Approve withdrawal
exports.approveWithdrawal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.type.toLowerCase() !== "withdraw")
      return res.status(404).json({ success: false, message: "Withdrawal not found" });

    const wallet = await prisma.wallet.findUnique({
      where: { userId: transaction.userId },
    });

    if (wallet.balance < transaction.amount)
      return res.status(400).json({ success: false, message: "Insufficient wallet balance" });

    await prisma.wallet.update({
      where: { userId: transaction.userId },
      data: { balance: { decrement: transaction.amount } },
    });

    await prisma.transaction.update({
      where: { id },
      data: { status: "Success" },
    });

    res.json({ success: true, message: "Withdrawal approved and wallet debited" });
  } catch (err) {
    console.error("Approve withdrawal error:", err);
    res.status(500).json({ success: false, message: "Withdrawal approval failed" });
  }
};

// ✅ Decline withdrawal
exports.declineWithdrawal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.transaction.update({
      where: { id },
      data: { status: "Failed" },
    });
    res.json({ success: true, message: "Withdrawal declined" });
  } catch (err) {
    console.error("Decline withdrawal error:", err);
    res.status(500).json({ success: false, message: "Failed to decline withdrawal" });
  }
};

// ✅ Manual wallet update (credit/debit)
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

    res.json({ success: true, wallet, transaction, message: `Wallet ${type} successful.` });
  } catch (err) {
    console.error("Wallet update error:", err);
    res.status(500).json({ success: false, message: "Wallet update failed" });
  }
};
