import express from 'express';
import connection from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js'
import jsonwebtoken from 'jsonwebtoken'
import secret from '../secret.js';

const postRouter = express.Router();

postRouter.get("/allPosts", authMiddleware, (req, res) => {

    connection.query("select fullname,email,video_url,profil_pic from posts p cross join users u on p.user_id=u.id ", (err, result) => {

        if (err) {
            res.json({
                success: 0,
                error: err.message
            })
        } else {

            if (result) {
                res.json({
                    result,
                    success: 1
                })
            } else {
                res.json({
                    success: 1,
                    error: "No posts"
                })
            }
        }
    })


})


postRouter.get("/:id", authMiddleware, (req, res) => {

    const id = req.params.id;

    connection.query("select fullname,email,video_url,profil_pic from posts p inner join users u on p.user_id=u.id where p.id=?", [id], (err, result) => {

        if (err) {
            res.json({
                success: 0,
                error: err.message
            })
        } else {

            if (result.length > 0) {
                res.json({
                    result: result[0],
                    success: 1
                })
            } else {
                res.json({
                    success: 0,
                    error: "posts not found or invalid id"
                })
            }
        }
    })



})

postRouter.get("/mypost/:id", authMiddleware, (req, res) => {

    const id = req.params.id;

    connection.query("select fullname,email,video_url,profil_pic from posts p inner join users u on p.user_id=u.id where u.id=?", [id], (err, result) => {

        if (err) {
            res.json({
                success: 0,
                error: err.message
            })
        } else {

            if (result.length > 0) {
                res.json({
                    result: result,
                    success: 1
                })
            } else {
                res.json({
                    success: 0,
                    error: "user not found or invalid user id"
                })
            }
        }
    })

})

postRouter.post("/dolike/:id", authMiddleware, (req, res) => {

    const id = req.params.id;

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
            connection.query("insert into likes (user_id,post_id) values(?,?)", [user.id, id], (err, result) => {
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
        }
    });
})

postRouter.delete('/dontlike/:id', authMiddleware, (req, res) => {

    const id = req.params.id;

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
            connection.query("delete from likes where user_id = ? and post_id = ?", [user.id, id], (err, result) => {
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
        }
    });



})

postRouter.get("/checklike/:id", authMiddleware, (req, res) => {

    const id = req.params.id;

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
            connection.query("select * from likes where user_id = ? and post_id = ?", [user.id, id], (err, result) => {
                if (err) {
                    res.json({
                        success: 0,
                        error: err.message
                    })
                } else {
                    if (result.length > 0) {
                        res.json({
                            success: 1,
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


postRouter.get('/countlikes/:id', authMiddleware, (req, res) => {

    const id = req.params.id;

    connection.query("select count(*) as count from likes where post_id = ?", [id], (err, result) => {
        if (err) {
            res.json({
                success: 0,
                error: err.message
            })
        } else {
            if (result.length > 0) {
                res.json({
                    result: result[0]
                })
            } else {
                res.json({
                    success: 0,
                })
            }
        }
    })

})


export default postRouter