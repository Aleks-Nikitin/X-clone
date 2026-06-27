import express,{urlencoded} from "express";
import authRotuer from "./routes/authRouter.js";
import userRotuer from "./routes/userRouter.js";
import refreshRouter from "./routes/refreshRouter.js";
import cors from "cors";
import "./controllers/passportController.js"
const app =express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use("/refresh",refreshRouter);
app.use("/auth",authRotuer);
app.use('/users',userRotuer);

app.listen(3000,"localhost",(err)=>{
    if(err){
        throw new Error("server is down");
        
    }
    console.log("server started")
})