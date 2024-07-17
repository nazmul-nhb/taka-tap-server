import express from "express";
import { userCollection } from "../db/takaDB.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// get all users except admin accounts
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const filter = { account_type: { $ne: 'admin' } };
        const result = await userCollection.find(filter).toArray();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error Occurred: ', error);
    }
});

// get single user info
router.get('/single', verifyToken, async (req, res) => {
    try {
        const email = req.query.email;
        const result = await userCollection.findOne({ email });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error Occurred: ', error);
    }
});

// update a user with admin account
router.patch('/:email', verifyToken, verifyAdmin, async (req, res) => {
    const user =req.body;
    const filter = { email: req.params.email };
    const options = { upsert: true };
    const updatedUser = { $set: user };
    const result = await userCollection.updateOne(filter, updatedUser, options);
    res.send(result);
})

export default router;