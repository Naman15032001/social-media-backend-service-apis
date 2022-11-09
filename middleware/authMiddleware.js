import jwt from 'jsonwebtoken';
import secret from '../secret.js';

function authMiddleware(req, res, next) {

    const authHeader = req.headers['authorization'];

    console.log("hello1", authHeader)

    const token = authHeader && authHeader.split(" ")[1];

    console.log("hello2", token)

    if (token == null) {
        res.json({
            error: "auth failed",
            success: 0
        })
    } else {

        jwt.verify(token, secret, (err, user) => {

            if (err) {
                res.json({
                    error: "auth failed",
                    success: 0,
                    here: "here"
                })
            } else {
                next();
            }
        });

    }
}

export default authMiddleware;