import jwt from "jsonwebtoken";
import {prisma} from "../lib/prisma.js"
import "dotenv/config";

async function handleLogout(req,res) {
    const refreshToken = req.cookies?.jwt || req.body?.refreshToken;
    if(!refreshToken){
        return res.sendStatus(204);
    }
     let userFound = await prisma.user.findUnique({
        where:{
            refreshToken: refreshToken
        }
    });
    if(!userFound){
        res.clearCookie("jwt",{httpOnly:true,maxAge: 2*24*60*60*1000,secure: true,sameSite: "none"});
        return res.sendStatus(204);
    }

    await prisma.user.update({
        where:{
            id:Number(userFound.id)
        },
        data:{
            refreshToken:null
        }
    })
    res.clearCookie("jwt",{httpOnly:true,maxAge: 2*24*60*60*1000,secure: true, sameSite: "none", });
    res.sendStatus(204);
}


export default {
    handleLogout
}
