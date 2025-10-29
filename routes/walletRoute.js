const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, walletController.getWallet);
router.post("/deposit", authMiddleware, walletController.deposit);
router.post("/withdraw", authMiddleware, walletController.withdraw);
router.get("/transactions", authMiddleware, walletController.getTransactions);

module.exports = router;
