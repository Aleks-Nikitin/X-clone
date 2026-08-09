import express,{urlencoded} from "express";
import {createServer} from "http"
import { Server } from "socket.io";
import authRotuer from "./routes/authRouter.js";
import userRotuer from "./routes/userRouter.js";
import refreshRouter from "./routes/refreshRouter.js";
import cookieParser from "cookie-parser";
import authController from "./controllers/authController.js";
import chatRouter from "./routes/chatRouter.js";
import cors from "cors";
import logoutRouter from "./routes/logoutRouter.js";
import "./controllers/passportController.js"
import postRouter from "./routes/postRouter.js";
import commentRouter from "./routes/commentRouter.js";
const app =express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:process.env.FRONTEND_URL,
        credentials:true
    }
})

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use("/refresh",refreshRouter);
app.use("/auth",authRotuer);
app.use("/logout",logoutRouter);
app.use(authController.verifyJWT);

app.use('/users',userRotuer);
app.use('/posts',postRouter);
app.use("/chats",chatRouter)
app.use('/comments',commentRouter)

io.on("conncetion",(socket)=>{
    console.log(`User connected ${socket.id}`)
    socket.on("join_chat",(chatId)=>{
        socket.join(`chat_${chatId}`);
        console.log(`Socket ${socket.id} joined room: chat_${chatId}`);
    })
    socket.on("leave_chat",(chatId)=>{
        socket.leave(`chat_${chatId}`)
    })
    socket.on("send_message",(messagePayload)=>{
        socket.to(`chat_${messagePayload.chatId}`).emit("receive_message",messagePayload);
    })
    socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
})

httpServer.listen(3000,"localhost",(err)=>{
    if(err){
        throw new Error("server is down");
        
    }
    console.log("server started")
})