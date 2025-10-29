import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- Function to update daily profits ---
const updateDailyProfits = async () => {
  try {
    console.log("Starting daily profit top-up...");

    const activeInvestments = await prisma.investment.findMany({
      where: { status: "active" },
      include: { plan: true, user: true },
    });

    const now = new Date();

    for (const inv of activeInvestments) {
      const lastUpdate = inv.lastProfitUpdate || inv.createdAt;
      const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

      if (diffDays >= 1) {
        // Calculate profit for the number of days passed
        const dailyProfit = inv.amount * inv.plan.dailyReturn * diffDays;

        // Update investment profit and last update
        await prisma.investment.update({
          where: { id: inv.id },
          data: {
            profitAccumulated: inv.profitAccumulated + dailyProfit,
            lastProfitUpdate: now,
          },
        });

        // Update user's wallet
        await prisma.user.update({
          where: { id: inv.userId },
          data: { wallet: inv.user.wallet + dailyProfit },
        });

        // Check if investment duration is over (skip unlimited plans with duration = null)
        if (inv.plan.duration && (now - inv.createdAt) / (1000 * 60 * 60 * 24) >= inv.plan.duration) {
          await prisma.investment.update({
            where: { id: inv.id },
            data: { status: "completed" },
          });
        }

        console.log(`Profit added for user ${inv.userId} from plan ${inv.plan.name}`);
      }
    }

    console.log("Daily profit top-up completed.");
  } catch (err) {
    console.error("Error updating daily profits:", err);
  }
};

// --- Schedule Cron Job ---
// Runs every day at midnight
cron.schedule("0 0 * * *", () => {
  updateDailyProfits();
});

// Optionally run immediately on start
updateDailyProfits();
