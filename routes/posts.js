import express from 'express';
import connection from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js'

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


export default postRouter