import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/takaDB.js";
import { corsOptions } from "./configs/corsConfig.js";
import authRoutes from "./routes/authentication.js";
import userRoutes from "./routes/users.js";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);

app.get("/", async (req, res) => {
    res.send("Taka Server is Running!");
});

const run = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Taka Server is Running on Port: ${port}`);
    });
};

run().catch(console.dir);