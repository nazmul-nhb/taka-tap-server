import express from "express";
import { transactionCollection, userCollection } from "../db/takaDB.js";
import { verifyToken, verifyAgent, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// function to generate transaction id
const generateTransactionID = () => {
    const date = Date.now();

    // generate a random string of 11 alphanumeric characters
    const randomString = Array.from({ length: 11 }, () => Math.random().toString(36).slice(2, 3)).join('');

    return `tt_${date}_${randomString}`;
};

// cash in/out request from user
router.post('/request', verifyToken, async (req, res) => {
    try {
        // const userEmail = req.user.email;
        const { name, mobile, email } = req.user;

        const transInfo = req.body;

        // const user = await userCollection.findOne({ email: userEmail });

        // delete user.pin;
        // delete user._id;

        const agentExists = await userCollection.findOne({
            mobile: transInfo.agent,
            account_type: "agent"
        });

        if (!agentExists) {
            return res.send({ success: false, message: 'Provide A Valid Agent Number!' }); 
        }

        const transaction = {
            name, mobile, email, ...transInfo
        };

        // add pending request in transaction collection
        const transactionResult = await transactionCollection.insertOne(transaction);

        if (transactionResult.insertedId) {
            return res.status(201).send({ success: true, message: 'Cash In Request Sent!' });
        } else {
            return res.status(500).send({ success: false, message: 'Request Failed!' });
        }

    } catch (error) {
        console.error("Cash In Error: ", error);
        res.status(500).send({ message: 'Internal Server Error!' });
    }
});

// cash in route
router.post('/in', verifyToken, verifyAgent, async (req, res) => {
    try {
        // const amount = parseInt(req.params.amount);
        const transaction = req.body;

        const updatedBalance = { $inc: { balance: transaction.amount } };
        const options = { returnDocument: 'after' };

        // update balance in user profile and get updated info
        const user = await userCollection.findOneAndUpdate({ email: transaction.email }, updatedBalance, options);

        if (!user) {
            return res.status(500).send({ success: false, message: 'User Not Found! Cash In Failed!' });
        }

        // delete user.pin;
        // delete user._id;

        // const transaction = {
        //     ...user, transactionID: generateTransactionID(), cash_in_amount: amount, agent, cash_in_time
        // };

        const updatedTransaction = {
            $set: {
                ...transaction,
                transactionID: generateTransactionID(),
                request_status: 'paid'
            },
            $unset: {
                pin: "",
                _id: ""
            }
        };

        // update balance in transaction collection
        const transactionResult = await transactionCollection.updateOne(
            { email: transaction.email }, updatedTransaction, { upsert: true }
        );

        if (transactionResult.modifiedCount > 0) {
            return res.status(201).send({ success: true, message: 'Cash In Succeeded!' });
        } else {
            return res.status(500).send({ success: false, message: 'Cash In Failed!' });
        }

    } catch (error) {
        console.error("Cash In Error: ", error);
        res.status(500).send({ message: 'Internal Server Error!' });
    }
});




export default router;