import {prisma} from "../lib/prisma.js"
async function getMe(req,res) {
    const id=req.user;
    const user = await prisma.user.findUnique({
        where:{
            id:Number(id)
        },
        include:{
            _count:{
                select:{
                    followers:true,
                    following:true
                }
            }
        }
    })
    return res.json({user:user});   
}
async function toggleFollowing(req,res) {
    try {
        const myId = req.user;
    const {targetUserId}= req.params;
    if(!myId || !targetUserId){
        return res.sendStatus(401)
    }
    if(Number(myId) === Number(targetUserId)){
        return res.send(400).json({msg:"can't follow yourself"})
    }
    const me = await prisma.user.findUnique({
        where:{
            id: Number(myId)
        },
        include:{
            following:{
                where:{
                    id:Number(targetUserId)
                }
            }
        }
    })
    let follow = me.following.length >0

    if(follow){
        await prisma.user.update({
          where:{
            id: Number(myId)
          },
          data:{
            following:{
                disconnect:{
                    id: Number(targetUserId)
                }
            }
          }
        })
        return res.send(201).json({msg:"unfollowed a user",isFollowing:false})
    }else{
        await prisma.user.update({
            where:{
                id:Number(myId)
            },
            data:{
                following:{
                    connect:{
                        id:Number(targetUserId)
                    }
                }
            }
        })
        return res.send(201).json({msg:"followed a user",isFollowing:true})
    }
    } catch (error) {
        res.sendStatus(500);
    }
    

}
export default {
    getMe,
    toggleFollowing
}