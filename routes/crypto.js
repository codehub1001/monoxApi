const express = require("express");
const axios = require("axios");

const router = express.Router();

// Cache BTC price to avoid hitting CoinGecko rate limits
let cachedPrice = null;
let lastFetched = 0;

router.get("/btc-price", async (req, res) => {
  const now = Date.now();

  // If cached value is less than 1 minute old, return it
  if (cachedPrice && now - lastFetched < 60000) {
    return res.json({ bitcoin: { usd: cachedPrice } });
  }

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );

    cachedPrice = response.data.bitcoin.usd;
    lastFetched = now;

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching BTC price:", error.message);
    res.status(500).json({ error: "Failed to fetch BTC price" });
  }
});

module.exports = router;
