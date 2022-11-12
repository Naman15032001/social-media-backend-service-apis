import express from 'express';
import connection from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js'
import jsonwebtoken from 'jsonwebtoken'
import secret from '../secret.js';

const friendRouter = express.Router();

friendRouter.post('/sendrequest', authMiddleware, (req, res) => {

    const friendid = req.body.id;

    const authHeader = req.headers['authorization'];

    console.log("hello1", authHeader)

    const token = authHeader && authHeader.split(" ")[1];

    jsonwebtoken.verify(token, secret, (err, user) => {

        if (err) {
            res.json({
                error: "auth failed",
                success: 0
            })
        } else {
            connection.query("insert into friends (sender_id,receiver_id) values(?,?)", [user.id, friendid], (err, result) => {
                if (err) {
                    res.json({
                        success: 0,
                        error: err.message
                    })
                } else {
                    if (result) {
                        res.json({
                            success: 1,
                        })
                    }
                }
            })
        }
    });
})

friendRouter.post('/acceptrequest', (req, res) => {

    const friendid = req.body.id;
    const authHeader = req.headers['authorization'];

    console.log("hello1", authHeader)

    const token = authHeader && authHeader.split(" ")[1];

    jsonwebtoken.verify(token, secret, (err, user) => {

        if (err) {
            res.json({
                error: "auth failed",
                success: 0
            })
        } else {
            connection.query("update  friends set status=1 where sender_id = ? and receiver_id=?", [friendid, user.id], (err, result) => {
                if (err) {
                    res.json({
                        success: 0,
                        error: err.message
                    })
                } else {
                    if (result) {
                        res.json({
                            success: 1,
                        })
                    }
                }
            })
        }
    });


})

friendRouter.post('/rejectrequest/:id', (req, res) => {

    const id = req.params.id;

    connection.query("delete from friends where id = ? ", [id], (err, result) => {
        if (err) {
            res.json({
                success: 0,
                error: err.message

            })
        } else {
            res.json({
                success: 1,
            })
        }
    })


})

friendRouter.get('/pendingrequests', authMiddleware, (req, res) => {

    const authHeader = req.headers['authorization'];

    console.log("hello1", authHeader)

    const token = authHeader && authHeader.split(" ")[1];

    jsonwebtoken.verify(token, secret, (err, user) => {

        if (err) {
            res.json({
                error: "auth failed",
                success: 0
            })
        } else {
            connection.query("select * from friends where receiver_id = ? and status = 0", [user.id], (err, result) => {
                if (err) {
                    res.json({
                        success: 0,
                        error: err.message
                    })
                } else {
                    if (result) {
                        res.json({
                            success: 1,
                            result: result
                        })
                    } else {
                        res.json({
                            success: 0,
                        })
                    }
                }
            })
        }
    });

})

friendRouter.get('/myfriends', authMiddleware, (req, res) => {

    const authHeader = req.headers['authorization'];

    console.log("hello1", authHeader)

    const token = authHeader && authHeader.split(" ")[1];

    jsonwebtoken.verify(token, secret, (err, user) => {

        if (err) {
            res.json({
                error: "auth failed",
                success: 0
            })
        } else {
            connection.query("select * from friends inner join users on users.id=friends.receiver_id  where sender_id = ? and status = 1", [user.id], (err, result) => {
                if (err) {
                    res.json({
                        success: 0,
                        error: err.message
                    })
                } else {
                    if (result) {
                        res.json({
                            success: 1,
                            result: result
                        })
                    } else {
                        res.json({
                            success: 0,
                        })
                    }
                }
            })
        }
    });

})

export default friendRouter