import jwt from "jsonwebtoken";
import { userCollection } from "../db/takaDB.js";

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
