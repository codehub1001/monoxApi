const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const cryptoRoutes = require("./routes/crypto");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const walletRoutes = require("./routes/walletRoute");
const adminRoutes = require("./routes/adminRoute");
const investmentRoutes = require("./routes/investmentRoute");

dotenv.config();

const app = express();
const server = http.createServer(app);

// --- CORS Setup ---
const corsOptions = {
  origin: "https://monox-iota.vercel.app", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // handles preflight OPTIONS automatically
// app.options("/*", cors(corsOptions)); // optional explicit preflight handling

app.use(express.json());

// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: "https://monox-iota.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Make io accessible in routes/controllers
app.set("io", io);

// --- API Routes ---
app.use("/api/crypto", cryptoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/investments", investmentRoutes);

// --- Root Route ---
app.get("/", (req, res) => res.send("✅ Monox API running..."));

// --- 404 Catch-All Middleware ---
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


// --- Socket.IO connection ---
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
