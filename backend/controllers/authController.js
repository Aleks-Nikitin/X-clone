import {prisma} from "../lib/prisma.js"
import jwt from "jsonwebtoken";
import "dotenv/config";

async function authCallbackGithub(req,res,next) {
    try {
        const userFound = req.user;
        if(!userFound){
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`)
        }
        const accessToken= jwt.sign({id:userFound.id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"});
        const refreshToken= jwt.sign({id:userFound.id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"2d"});
        await prisma.user.update({
        where:{
            id:Number(userFound.id)
        },
        data:{
            refreshToken:refreshToken
        }
        })
        res.cookie("jwt", refreshToken,{
            secure: process.env.NODE_ENV ==="production",
            httpOnly:true,
            maxAge:2*24*60*60*1000,
        });
        return res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${accessToken}`)
        res.json({accessToken:accessToken});

        } catch (error) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`)
        }
}
async function verifyJWT(req,res,next) {
    const authHeader = req.headers["authorization"];
    if(!authHeader) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err) return res.sendStatus(403); //invalid token
            req.user=decoded.id;
            next()
        }
    )

}
export default{
    authCallbackGithub,
    verifyJWT
}