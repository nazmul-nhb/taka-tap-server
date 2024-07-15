import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/takaDB.js";
import authRoutes from "./routes/authentication.js";

dotenv.config();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
];

// make dynamic link for every vercel deployment
const dynamicOriginPattern = /^https:\/\/nazmul-[a-z0-9]+-nazmul-hassans-projects\.vercel\.app$/;

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || dynamicOriginPattern.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not Allowed by CORS!'));
        }
    }
};

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors({ origin: corsOptions }));
app.use(express.json());

// routes
app.use('/auth', authRoutes);


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