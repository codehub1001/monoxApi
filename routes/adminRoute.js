const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

router.use(authMiddleware, isAdmin);

// ✅ User management
router.get("/users", adminController.getAllUsers);

// ✅ Deposit management
router.get("/deposits/pending", adminController.getPendingDeposits);
router.post("/deposits/:id/approve", adminController.approveDeposit);
router.post("/deposits/:id/decline", adminController.declineDeposit);

// ✅ Withdrawal management
router.get("/withdrawals/pending", adminController.getPendingWithdrawals);
router.post("/withdrawals/:id/approve", adminController.approveWithdrawal);
router.post("/withdrawals/:id/decline", adminController.declineWithdrawal);

// ✅ Manual wallet update
router.post("/wallet/:userId/update", adminController.updateWallet);
// ✅ Active Investments (new)
router.get("/investments/active", adminController.getAllActiveInvestments);

module.exports = router;
