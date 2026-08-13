import jwt from "jsonwebtoken";
import {prisma} from "../lib/prisma.js"
import "dotenv/config";

async function handleRefreshToken(req,res) {
    const refreshToken = req.cookies?.jwt || req.body?.refreshToken;
    if(!refreshToken){
        return res.sendStatus(401)
    }
     let userFound = await prisma.user.findUnique({
        where:{
            refreshToken: refreshToken
        }
    });
    if(!userFound){
        return res.sendStatus(403);
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err || userFound.id!== decoded.id) return res.sendStatus(403);
            const accessToken= jwt.sign(
                {id:decoded.id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:"15m"}

            )
            res.json({accessToken:accessToken});
        }
    ) 


}


export default {
    handleRefreshToken
}
