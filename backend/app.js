import express,{urlencoded} from "express";
import userRotuer from "./routes/userRouter.js";
const app =express();
app.use(express.urlencoded({extended:true}));


app.use('/users',userRotuer);

app.listen(3000,"localhost",(err)=>{
    if(err){
        throw new Error("server is down");
        
    }
    console.log("server started")
})