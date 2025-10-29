const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ Create investment
exports.createInvestment = async (req, res) => {
  let { planId, amount } = req.body;
  const userId = req.user.id; // from authMiddleware

  try {
    // Ensure numeric values
    planId = parseInt(planId);
    amount = parseFloat(amount);

    if (isNaN(planId) || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid plan or amount" });
    }

    // Find plan
    const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    // Validate amount
    if (amount < plan.amount)
      return res.status(400).json({ error: "Amount too low for this plan" });

    // Get user and wallet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });
    if (!user?.wallet)
      return res.status(404).json({ error: "Wallet not found" });

    if (user.wallet.balance < amount)
      return res.status(400).json({ error: "Insufficient wallet balance" });

    // ✅ Deduct amount from wallet
    await prisma.wallet.update({
      where: { id: user.wallet.id },
      data: { balance: { decrement: amount } },
    });

    // Calculate end date
    const endDate = plan.duration
      ? new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000)
      : null;

    // Create investment record
    const investment = await prisma.investment.create({
      data: {
        userId,
        planId,
        investedAmount: amount,
        currentAmount: amount,
        startDate: new Date(),
        endDate,
        lastProfitDate: new Date(),
        status: "active",
      },
      include: { plan: true },
    });

    res.json({ success: true, message: "Investment activated successfully", investment });
  } catch (err) {
    console.error("❌ Investment creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get user's investments
exports.getInvestments = async (req, res) => {
  const userId = req.user.id;
  try {
    const investments = await prisma.investment.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ investments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all investment plans
exports.getInvestmentPlans = async (req, res) => {
  try {
    const plans = await prisma.investmentPlan.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.json({ plans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
