// prisma/seed/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // --- Users to seed ---
  const usersData = [
    {
      username: "Alice",
      firstName: "Alice",
      lastName: "Smith",
      mobile: "08012345601",
      email: "alice@example.com",
      password: "alicepassword",
      role: "USER",
    },
    {
      username: "Bob",
      firstName: "Bob",
      lastName: "Johnson",
      mobile: "08012345602",
      email: "bob@example.com",
      password: "bobpassword",
      role: "USER",
    },
    {
      username: "Admin",
      firstName: "Admin",
      lastName: "User",
      mobile: "08012345603",
      email: "admin@example.com",
      password: "adminpassword",
      role: "ADMIN",
    },
  ];

  // --- Hash passwords and upsert users ---
  await Promise.all(
    usersData.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          mobile: user.mobile,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
      });
    })
  );

  console.log("✅ Users seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
