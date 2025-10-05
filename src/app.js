// Import express for express power
import express from "express";

// Import cors for coress origin
import cors from "cors";
import cookieParser from "cookie-parser";

// Initialize express app
const app = express();

// Config Cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Limite json data for previenting server crash
app.use(express.json({ limit: "16kb" }));

// Limite URL data for previenting server crash
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Config static for temporary file store
app.use(express.static("public"));

// Config cookie-perser
app.use(cookieParser());

// Import User Router
import userRouter from "./routes/user.routes.js";

// User Router Middleware
app.use("/api/v1/users", userRouter);

// Our API Local URL will be : http://localhost:8000/api/v1/users/...... whatever the method (register, login logout....)

export { app };
