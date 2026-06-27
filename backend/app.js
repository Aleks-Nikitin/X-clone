import express,{urlencoded} from "express";
import authRotuer from "./routes/authRouter.js";
import userRotuer from "./routes/userRouter.js";
import refreshRouter from "./routes/refreshRouter.js";
import cookieParser from "cookie-parser";
import authController from "./controllers/authController.js";
import cors from "cors";
import logoutRouter from "./routes/logoutRouter.js";
import "./controllers/passportController.js"
import postRouter from "./routes/postRouter.js";
import commentRouter from "./routes/commentRouter.js";
const app =express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use("/refresh",refreshRouter);
app.use("/auth",authRotuer);

app.use(authController.verifyJWT);

app.use('/users',userRotuer);
app.use('/posts',postRouter);
app.use('/comments',commentRouter)
app.use("/logout",logoutRouter);

app.listen(3000,"localhost",(err)=>{
    if(err){
        throw new Error("server is down");
        
    }
    console.log("server started")
})