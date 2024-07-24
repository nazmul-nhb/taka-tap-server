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

// error handler for 404
app.use((req, res, next) => {
    const error = new Error("Requested URL Not Found!");
    error.status = 404;
    next(error);
});

// final error handler
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).send({
        success: false,
        message: error.message || "Internal Server Error",
    });
});

const run = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Taka Server is Running on Port: ${port}`);
    });
};

run().catch(console.dir);