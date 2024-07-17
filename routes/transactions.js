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
        const { email, agent, cash_in_time } = req.body;

        const updatedBalance = { $inc: { balance: amount } };
        const options = { returnDocument: 'after' };

        // update balance in user profile and get updated info
        const user = await userCollection.findOneAndUpdate({ email }, updatedBalance, options);

        if (!user) {
            return res.status(500).send({ success: false, message: 'User Not Found! Cash In Failed!' });
        }

        delete user.pin;
        delete user._id;

        const transaction = {
            ...user, transactionID: generateTransactionID(), cash_in_amount: amount, agent, cash_in_time
        };

        // update balance in transaction collection
        const transactionResult = await transactionCollection.insertOne(transaction);

        if (transactionResult.insertedId) {
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