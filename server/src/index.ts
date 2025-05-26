import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import { Product } from "./models/Product";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
