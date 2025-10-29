const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const plans = [
    { name: "Starter Plan", amount: 5000, dailyReturn: 0.1, duration: 7 },
    { name: "Standard Plan", amount: 10000, dailyReturn: 0.15, duration: 7 },
    { name: "Premium Plan", amount: 15000, dailyReturn: 0.2, duration: 7 },
    { name: "Unlimited Plan", amount: 26000, dailyReturn: 0.35, duration: null },
  ];

  for (const plan of plans) {
    await prisma.investmentPlan.upsert({
      where: { name: plan.name },
      update: {},
      create: plan,
    });
  }

  console.log("Investment plans seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
