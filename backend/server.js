const express  = require("express");
const dotenv   = require("dotenv");
const cors     = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth",     require("./routes/auth"));
app.use("/api/members",  require("./routes/members"));
app.use("/api/projects", require("./routes/projects"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));