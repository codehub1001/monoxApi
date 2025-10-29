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
const investmentRoutes = require("./routes/investmentRoute"); // <-- new

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Make io accessible in routes/controllers
app.set("io", io);

app.use(
  cors({
    origin: ["https://monox-iota.vercel.app"], // your Vercel frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you’re sending cookies or tokens
  })
);
app.use(express.json());

// API routes
app.use("/api/crypto", cryptoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/investments", investmentRoutes); // <-- new

// Root route
app.get("/", (req, res) => res.send("✅ Monox API running..."));

// Socket connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Optional: listen for custom events here
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
