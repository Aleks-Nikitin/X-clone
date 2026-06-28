import {prisma }from "../lib/prisma.js"
async function createComment(req,res){

    try {
    const id = req.user;
    const {text}= req.body;
    const {postId}=req.params
    if (!text || text.trim() === "") {
            return res.status(400).json({ error: "Comment cannot be empty" });
        }
        const com = await prisma.comment.create({
        data:{
            userId:Number(id),
            text:text,
            postId:Number(postId)
        }
    })
    res.json({com:com});
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }

}

async function getCommentsByPost(req,res){

    try {
        const {postId}=req.params;
        const comments = await prisma.comment.findMany({
        where:{
            postId:Number(postId),
        },
        orderBy: { createdAt: 'desc' },
        include: {
            user: true,
        },
    })
    res.json({comments:comments});
    } catch (error) {
        res.sendStatus(500);
        
    }
   
}
async function getCommentsByUser(req,res) {
    
    try {
        const {userId}=req.params;
        const comments=await prisma.comment.findMany({
        where:{
            userId:Number(userId),
        },
          orderBy:{createdAt:"desc"}
    })
    res.json({comments:comments})
    } catch (error) {
         return res.sendStatus(500);
    }
   
}
async function deleteComment(req,res) {
    
    try {
    const id = req.user;
    const {commentId}=req.params;

        const com = await prisma.comment.findUnique({
            where: { id: Number(commentId) }
        });
        if (!com|| com.userId !== Number(id)) {
            return res.sendStatus(403); 
        }

        await prisma.comment.delete({
        where:{
            id:Number(commentId)
        }
    })
       return res.json({ msg: "Comment is deleted" });
    } catch (error) {
        return res.sendStatus(500);
    }
  
}
async function updateComment(req,res) {
    try {
        const id = req.user
         const {commentId}=req.params
        const {msg}=req.body;
             const comment = await prisma.comment.findUnique({
            where: { id: Number(commentId) }
        });

        if (!comment || comment.userId !== Number(id)) {
            return res.sendStatus(403); 
        }

    const updated = await prisma.comment.update({
        where:{
            id:Number(commentId),
        },
        data:{
            msg:msg,
        }
    })
    res.json({msg:updated})
    } catch (error) {
        res.sendStatus(500);
    }
   
}
export default {
    createComment,
    getCommentsByPost,
    getCommentsByUser,
    deleteComment,
    updateComment
}