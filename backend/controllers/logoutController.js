import jwt from "jsonwebtoken";
import {prisma} from "../lib/prisma.js"
import "dotenv/config";
async function handleLogout(req,res) {
    const cookies = req.cookies;
    if(!cookies?.jwt){
        return res.sendStatus(204);
        
    }
    const refreshToken = cookies.jwt;
     let userFound = await prisma.user.findUnique({
        where:{
            refreshToken: refreshToken
        }
    });
    if(!userFound){
        res.clearCookie("jwt",{httpOnly:true,maxAge: 2*24*60*60*1000,secure: process.env.NODE_ENV ==="production"});
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
    res.clearCookie("jwt",{httpOnly:true,maxAge: 2*24*60*60*1000,secure: process.env.NODE_ENV ==="production"}); // secure: true - only serves on https
    res.sendStatus(204);
}


export default {
    handleLogout
}