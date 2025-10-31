const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendEmail = require("../utils/emailService");
const investmentActivatedTemplate = require("../utils/emailTemplates/investmentActivatedTemplate"); // we'll create this next

// ✅ Create investment
exports.createInvestment = async (req, res) => {
  let { planId, amount } = req.body;
  const userId = req.user.id; // from authMiddleware

  try {
    planId = parseInt(planId);
    amount = parseFloat(amount);

    if (isNaN(planId) || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid plan or amount" });
    }

    const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    if (amount < plan.amount)
      return res.status(400).json({ error: "Amount too low for this plan" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });
    if (!user?.wallet)
      return res.status(404).json({ error: "Wallet not found" });

    if (user.wallet.balance < amount)
      return res.status(400).json({ error: "Insufficient wallet balance" });

    // ✅ Deduct wallet balance
    await prisma.wallet.update({
      where: { id: user.wallet.id },
      data: { balance: { decrement: amount } },
    });

    const endDate = plan.duration
      ? new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000)
      : null;

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

    // ✅ Send email notification
    try {
      await sendEmail(
        user.email,
        "Investment Activated Successfully ✅",
        investmentActivatedTemplate(user.firstName, investment)
      );
      console.log(`📩 Investment activation mail sent to ${user.email}`);
    } catch (mailErr) {
      console.error("❌ Failed to send investment email:", mailErr);
    }

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
