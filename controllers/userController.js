const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        wallet: true, // ✅ Include wallet info
        investments: {
          include: {
            plan: true, // ✅ Include plan details for display
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Optionally hide sensitive fields
    const { password, ...safeUser } = user;

    res.json({
      ...safeUser,
      totalInvestments: user.investments.length,
      activeInvestments: user.investments.filter(
        (inv) => inv.isActive === true || inv.isActive === "true"
      ).length,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, mobile, country, password } = req.body;
    const data = { firstName, lastName, mobile, country };

    if (password) data.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data,
    });

    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      mobile: updatedUser.mobile,
      country: updatedUser.country,
      referralCode: updatedUser.referralCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
