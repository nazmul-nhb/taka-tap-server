import jwt from "jsonwebtoken";
import { userCollection } from "../db/takaDB.js";

// verify jwt token
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized Access!' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: 'Invalid Token!' });
        }
        req.user = decoded;
        next();
    });
};

// verify if the user is admin
export const verifyAdmin = async (req, res, next) => {
    const user = req.user;
    const query = { email: user?.email };
    const result = await userCollection.findOne(query);

    if (!result || result?.account_type !== 'admin')
        return res.status(401).send({ message: 'Unauthorized Access!' });

    next();
};

// verify if a user is an agent
export const verifyAgent = async (req, res, next) => {
    const user = req.user;
    const query = { email: user?.email };
    const result = await userCollection.findOne(query);

    if (!result || result?.account_type !== 'agent' || result?.account_type !== 'admin')
        return res.status(401).send({ message: 'Unauthorized Access!' });

    next();
};