import dotenv from "dotenv";
dotenv.config(); // MUST BE FIRST

import express from "express";

// Routes
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import marksRoutes from "./routes/marksRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());

// 🔥 CORS (simple version)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes); // fixed
app.use("/api/marks", marksRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/subjects", subjectRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("ERP Backend Running 🚀");
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);

// // ================= SERVER =================
// const PORT = process.env.PORT || 5000;

// console.log("🚀 Starting server...");

// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

// ================= EXPORT =================
export default app;