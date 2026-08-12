import {prisma} from "../lib/prisma.js"
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import "dotenv/config";

async function authCallbackGithub(req,res,next) {
    try {
        const userFound = req.user;
        if(!userFound){
            return res.redirect(`${process.env.FRONTEND_URL}/?error=no_user`)
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
            sameSite: "none", 
            httpOnly:true,
            maxAge:2*24*60*60*1000,
        });
        return res.redirect(`${process.env.FRONTEND_URL}/`)

        } catch (error) {
            return res.redirect(`${process.env.FRONTEND_URL}/?error=server_error`)
        }
}

async function guestSignIn(req, res) {
    try {
        const suffix = randomUUID().slice(0, 8);
        const username = `guestUser_${suffix}`;
        const user = await prisma.user.create({
            data: {
                username,
                email: `${username}@guest.local`,
                fullName: "Guest",
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
                picture: true,
            },
        });

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "2d" }
        );
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        res.cookie("jwt", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "none", 
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({ accessToken, user });
    } catch (error) {
        console.error("guestSignIn error:", error);
        return res.status(500).json({ error: "server_error" });
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
    guestSignIn,
    verifyJWT
}
