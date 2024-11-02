import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/user.route.js";
import bookRoutes from "./routes/book.route.js";
import listRoutes from "./routes/list.route.js";
import reviewsRoutes from "./routes/review.route.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
     cors({
          origin: ["http://localhost:5173"],
          methods: ["GET", "POST", "PUT", "DELETE"],
          allowedHeaders: ["Content-Type", "Authorization"],
          credentials: true,
     })
);

app.use("/", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/reviews", reviewsRoutes);

app.use(errorHandler);

// Connect to the database when the module is loaded
connectDB();

// Export the app as a serverless handler for Vercel
export default app;
