import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userCollection } from "../db/takaDB.js";

const router = express.Router();

// register a user
router.post('/register', async (req, res) => {
    try {
        const user = req.body;
        const rawPIN = user.pin;

        // check for existing user
        const userExists = await userCollection.findOne({ $or: [{ email: user.email }, { mobile: user.mobile }] });

        if (userExists) {
            return res.status(409).send({ message: 'User Already Exists!' });
        };

        // generate hashed PIN
        const hashedPIN = await bcrypt.hash(rawPIN, 13);
        user.pin = hashedPIN;
        user.account_status = 'pending';

        const result = await userCollection.insertOne(user);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error Registering User: ", error);
        res.status(500).send({ message: "Registration Error!" });
    }
});

// login a user
router.post('/login', async (req, res) => {
    // console.log(req.body);
    try {
        const { credential, pin } = req.body;

        const user = await userCollection.findOne({ $or: [{ email: credential }, { mobile: credential }] });

        if (!user) {
            return res.status(404).send({ success: false, message: "Account Not Found!" });
        }

        const pinMatched = await bcrypt.compare(pin, user.pin);

        if (!pinMatched) {
            return res.status(401).send({ success: false, message: "Wrong PIN!" });
        }

        if (user.account_status !== 'active') {
            return res.status(403).send({ success: false, message: "Account Not Active!" });
        }

        delete user.pin;

        const token = jwt.sign(user, process.env.TOKEN_SECRET);

        res.status(200).send({ token, success: true, message: "Successfully Logged In!" });
    } catch (error) {
        console.error("Error Logging in User: ", error);
        res.status(500).send({ message: "Login Error!" });
    }
});

export default router;