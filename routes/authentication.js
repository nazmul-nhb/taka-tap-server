import express from "express";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { userCollection } from "../db/takaDB.js";

const router = express.Router();

// register user
router.post('/register', async (req, res) => {
    try {
        const user = req.body;
        const rawPIN = user.pin;

        // check for existing user
        const userExists = await userCollection.findOne({ $or: [{ email: user.email }, { mobile: user.mobile }] });
        
        if (userExists) {
            return res.status(409).send({ message: 'User Already Exists!' });
        };

        // generate hashed pin
        const hashedPIN = await bcrypt.hash(rawPIN, 12);
        user.pin = hashedPIN;

        const result = await userCollection.insertOne(user);
        res.send(result);
    } catch (error) {
        console.error("Error Registering User: ", error);
        res.status(500).send({ message: "Registration Error!" });
    }
});



export default router;