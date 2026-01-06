import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/users.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import growthRoutes from "./routes/growthRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import scaleRoutes from "./routes/scaleRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => res.json({ message: "Engine v1 Backend Running" }));

// API routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/growth", growthRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/scale", scaleRoutes);
app.use("/api/modules", moduleRoutes);

export default app;
