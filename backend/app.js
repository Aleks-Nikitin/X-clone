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
app.set('trust proxy', 1);
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

io.on("connection",(socket)=>{
    console.log(`User connected ${socket.id}`)
    socket.on("join_chat",(chatId)=>{
        const roomName =`chat_${String(chatId)}`
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room: ${roomName}`);
    })
    socket.on("leave_chat",(chatId)=>{
         const roomName =`chat_${String(chatId)}`
        socket.leave(roomName)
        console.log(`Socket left room: ${roomName}`);
    })
    socket.on("send_message",(data)=>{
         const targetRoom = `chat_${String(data.chatId)}`
        socket.to(targetRoom).emit("receive_message", data);
    })
    socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
})

httpServer.listen(process.env.PORT,"0.0.0.0",(err)=>{
    if(err){
        throw new Error("server is down");
        
    }
    console.log("server started")
})