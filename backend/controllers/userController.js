async function getMe(req,res) {
    const id=req.user;
    const user = await prisma.user.findUnique({
        where:{
            id:Number(id)
        }
    })
    return res.json({user:user});
    
}

export default {
    getMe
}