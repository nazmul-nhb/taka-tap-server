import express from "express";
import { transactionCollection, userCollection } from "../db/takaDB.js";
import { verifyToken, verifyAgent, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

const generateTransactionID = () => {
    const prefix = 'taka_tap';
    const date = new Date();
    const formattedDate = date.toISOString().replace(/[-:.TZ]/g, '');

    // generate a random string of 8 alphanumeric characters
    const randomString = Array.from({ length: 8 }, () => Math.random().toString(36).slice(2, 3)).join('');

    return `${prefix}-${formattedDate}${randomString}`;
};

// cash in route
router.post('/in/:amount', async (req, res) => {
    try {
        const amount = parseInt(req.params.amount);

        const filter = { email: req.body.email };
        const user = await userCollection.findOne(filter);

        const updatedBalance = { $inc: { balance: amount } };
        const options = { upsert: true };
        
        // update balance in user profile
        const userResult = await userCollection.updateOne(filter, updatedBalance, options);

        user.transactionID = generateTransactionID();
        delete user.pin;

        // update balance in transaction collection
        const transactionResult = await transactionCollection.insertOne();

        if (userResult.modifiedCount > 0 && transactionResult.insertedId) {
            return res.send({ success: true, message: 'Cash In Succeeded!' });
        } else {
            return res.status(500).send({ success: false, message: 'Cash In Failed!' });
        }

    } catch (error) {
        console.error("Cash In Error: ", error);
        res.status(500).send({ message: 'Internal Server Error!' });
    }
});


export default router;