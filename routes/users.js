import express from "express";
import { userCollection } from "../db/takaDB.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// get all users except admin accounts
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const filter = { account_type: { $ne: 'admin' } };
        const result = await userCollection.find(filter).toArray();
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error!' });
    }
});

// get agent list for users
router.get('/agents', verifyToken, async (req, res) => {
    try {
        const result = await userCollection.find({ account_type: 'agent' }).toArray();
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error!' });
    }
})

// get single user info
router.get('/single', verifyToken, async (req, res) => {
    try {
        const email = req.query.email;
        const result = await userCollection.findOne({ email });
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error!' });
    }
});

// update a user with admin account
router.patch('/:email', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const user = req.body;
        const filter = { email: req.params.email };
        const options = { upsert: true };
        const updatedUser = { $set: user };
        const result = await userCollection.updateOne(filter, updatedUser, options);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error!' });
    }
});


export default router;