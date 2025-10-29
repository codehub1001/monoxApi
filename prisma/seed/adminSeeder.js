const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  const email = "admin@monoxtrades.com";
  const password = "Admin@123"; // You can change this
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (existingAdmin) {
    console.log("⚠️ Admin user already exists.");
    return;
  }

  const admin = await prisma.user.create({
    data: {
      firstName: "Monox",
      lastName: "Admin",
      username: "monoxadmin", // ✅ added username
      email,
      mobile: "0000000000",
      country: "Nigeria",
      password: hashedPassword,
      role: "ADMIN", // make sure 'role' exists in schema
      referralCode: "ADMINCODE",
      wallet: {
        create: {
          balance: 0,
        },
      },
    },
  });

  console.log("✅ Admin user created successfully:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
