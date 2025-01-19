import dotenv from "dotenv";
import connectDb from "./db/index.js";

import express from "express";

dotenv.config()

connectDb();

const app = express();

