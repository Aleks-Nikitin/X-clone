import {prisma} from "../lib/prisma.js"
async function getMe(req,res) {
    const id=req.user;
    const user = await prisma.user.findUnique({
        where:{
            id:Number(id)
        },
        select:{
            id:true,
            username:true,
            fullName:true,
            email:true,
            picture:true,
            _count:{
                select:{
                    followers:true,
                    following:true,
                    posts:true
                }
            }
        }
    })
    return res.json({user:user});   
}
async function getSugestedFollowing(req,res) {
    try {
        const id = req.user;
        const me = await prisma.user.findUnique({
            where:{
                id:Number(id)
            },
            select:{
                following:{
                    select:{
                        id:true
                    }
                }
            }
        })
        const followedIds = me ? me.following.map((user)=> user.id) : [];
        const users = await prisma.user.findMany({
            take:30,
            where:{
                id:{
                    not:Number(id),
                    notIn: followedIds
                }
            },
            select:{
                username:true,
                fullName:true,
                id:true,
                picture:true,
            }
        })
        return res.json({users});
    } catch (error) {
        return res.sendStatus(500);
    }
}

async function getUserById(req,res) {
    try {
        const myId = req.user;
        const { userId } = req.params;
        const user = await prisma.user.findUnique({
            where:{
                id:Number(userId)
            },
            select:{
                id:true,
                username:true,
                fullName:true,
                picture:true,
                _count:{
                    select:{
                        followers:true,
                        following:true,
                        posts:true
                    }
                },
                followers:{
                    where:{
                        id:Number(myId)
                    },
                    select:{
                        id:true
                    }
                }
            }
        })
        if(!user){
            return res.sendStatus(404);
        }
        const { followers, ...profile } = user;
        return res.json({
            user:{
                ...profile,
                isFollowing: followers.length > 0
            }
        });
    } catch (error) {
        return res.sendStatus(500);
    }
}

async function toggleFollowing(req,res) {
    try {
        const myId = req.user;
    const {targetUserId}= req.params;
    if(!myId || !targetUserId){
        return res.sendStatus(401)
    }
    if(Number(myId) === Number(targetUserId)){
        return res.status(400).json({msg:"can't follow yourself"})
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
        return res.status(201).json({msg:"unfollowed a user",isFollowing:false})
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
        return res.status(201).json({msg:"followed a user",isFollowing:true})
    }
    } catch (error) {
        res.sendStatus(500);
    }
    

}
export default {
    getMe,
    getUserById,
    toggleFollowing,
    getSugestedFollowing
}