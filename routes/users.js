import express from "express";
import { userCollection } from "../db/takaDB.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// get single user info
router.get('/single', verifyToken, async (req, res) => {
    const email = req.query.email;
    const result = await userCollection.findOne({ email });
    res.send(result);
});

export default router;