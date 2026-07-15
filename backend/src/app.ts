import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongoDB } from "./config/mongodb.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
// Connect to MongoDB
await connectMongoDB();

export default app;