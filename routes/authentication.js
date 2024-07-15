import express from "express";
import { userCollection } from "../db/takaDB.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// get users
router.get('/', async (req, res) => {
    try {
        const result = await userCollection.find().toArray();
        res.send("Hello from Auth!");
    } catch (error) {
        console.error("Error Fetching Users:", error);
        res.status(500).send({ message: "Internal Server Error!" });
    }
});



export default router;