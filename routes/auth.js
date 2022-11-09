import express from 'express';
import connection from '../db.js'
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken'
import secret from '../secret.js';
import authMiddleware from '../middleware/authMiddleware.js'

const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {


    let {
        fullname,
        password,
        email,
        profil_pic
    } = req.body;

    password = await bcrypt.hash(password, 10)
    connection.query("INSERT into users (fullname,password,email,profil_pic) values (?,?,?,?)", [fullname, password, email, profil_pic],
        (err, result) => {

            if (err) {
                res.json({
                    merror: err.message,
                    success: 0
                })
            } else if (result) {
                res.json({
                    email,
                    fullname,
                    profil_pic
                })
            }
        })

})

authRouter.post("/login", (req, res) => {

    let {
        email,
        password,
    } = req.body;
    console.log(req.body);
    console.log(email)
    connection.query('select * from users where email=?', [email],
        async (err, result) => {
            if (err) {
                res.json({
                    error: err.message,
                    success: 0
                })
            } else {
                if (result.length > 0) {

                    const ans = await bcrypt.compare(password, result[0].password)

                    if (ans) {
                        delete result[0].password;
                        const token = await jsonwebtoken.sign({
                            ...result[0]
                        }, secret, {
                            expiresIn: '10h'
                        })
                        res.json({
                            ...result[0],
                            token
                        })

                    } else {
                        res.json({
                            error: 'incorrect password',
                            success: 0
                        });

                    }

                } else {
                    res.json({
                        error: "user not found",
                        success: 0
                    })
                }
            }
        }
    )

});


authRouter.post("/getUserFromToken", authMiddleware, (req, res) => {

    let token = req.body.token;

    console.log("naman",token)

    jsonwebtoken.verify(token, secret, (err, user) => {

        if (err) {
            res.json({
                error: "auth failed",
                success: 0
            })
        } else {
            res.json({
                user
            })
        }
    });

})

export default authRouter;