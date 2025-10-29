const express = require("express");
const router = express.Router();
const investmentController = require("../controllers/investmentController");
const authMiddleware = require("../middlewares/authMiddleware");

// User investments
router.get("/my-investments", authMiddleware, investmentController.getInvestments);

// Create new investment
router.post("/", authMiddleware, investmentController.createInvestment);

// Get all investment plans
router.get("/plans", authMiddleware, investmentController.getInvestmentPlans);

module.exports = router;
