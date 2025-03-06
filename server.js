import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./Routes/userRoute.js";

dotenv.config();

const app = express();

// CORS configuration
const whitelist = ["http://localhost:5173", process.env.PAGEURL];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle pre-flight requests (OPTIONS)
app.options("*", cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `MongoDB connected and Listening on port ${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", userRoute);
