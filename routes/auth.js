import express from 'express';
import  connection from '../db.js'
import bcrypt from 'bcrypt';

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

    let {
        fullname,
        password,
        email,
        profil_pic
    } = req.body;

    password = await bcrypt.hash(password, 10)
    connection.query("INSERT into users (fullname,password,email,profil_pic) values (?,?,?,?)" ,[fullname, password, email, profil_pic],
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

export default authRouter;