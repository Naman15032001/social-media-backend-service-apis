import express, {
    application
} from "express";
import authRouter from "./routes/auth.js";
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

    //res.end("hello");

})

app.use("/api/auth", authRouter)

app.listen(8080, () => {
    console.log("server is running on port 8080");
})