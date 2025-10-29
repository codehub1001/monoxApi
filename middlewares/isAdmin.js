// middlewares/isAdmin.js
module.exports = function (req, res, next) {
  try {
    if (req.user && req.user.role === "ADMIN") {
      return next();
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Server error checking admin access" });
  }
};
