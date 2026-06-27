import express,{urlencoded} from "express";
import authRotuer from "./routes/authRouter.js";
import userRotuer from "./routes/userRouter.js";
import "./controllers/passportController.js"
const app =express();
app.use(express.urlencoded({extended:true}));
app.use("/auth",authRotuer);
app.use('/users',userRotuer);

app.listen(3000,"localhost",(err)=>{
    if(err){
        throw new Error("server is down");
        
    }
    console.log("server started")
})