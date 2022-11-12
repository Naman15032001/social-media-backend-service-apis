import express, {
    application
} from "express";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/posts.js";
import friendRouter from "./routes/friends.js";
import cors from "cors"


const app = express();

app.use(cors({
    origin: "*"
}))

app.use(express.json());

app.get("/test", (req, res) => {

    res.json({
        success: 1
    })

})

app.use("/api/auth", authRouter)

app.use("/api/posts", postRouter)

app.use("/api/friends", friendRouter)

app.listen(8080, () => {
    console.log("server is running on port 8080");
})