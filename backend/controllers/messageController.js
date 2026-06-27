import {prisma} from "../lib/prisma.js"
async function createMsg(req,res) {
    try {
        const id = req.user;
        const {chatId} = req.params
        const {text} = req.body;
        if (!text || text.trim() === "") {
                return res.status(400).json({ error: "Message cannot be empty" });
            }
        const msg= await prisma.message.create({
            data:{
                text:text,
                userId:Number(id),
                chatId:Number(chatId)
            }
            
        }); 
        
        res.json({
            text:msg.text,
            userId:msg.id,
            chatId:msg.chatId,
            id:msg.id,
            createdAt:msg.createdAt})
    } catch (error) {
        res.sendStatus(500);
    }
   
}  
 async function editMessage(req,res) {
    try {
    const id = req.user;
    const {messageId} = req.params
    const {text} = req.body;
    if (!text || text.trim() === "") {
            return res.status(400).json({ error: "Message cannot be empty" });
    }
    const message = await prisma.message.findUnique({
        where:{
            id:Number(messageId)
        }
    })
    if(!message){
         return res.status(404).json({ error: "Message can't be found" });
    }
    if (Number(message.userId) !== Number(id)) {
            return res.status(403).json({ error: "Message can only be edited by the sender" });
    }
   const editedMessage = await prisma.message.update({
        where:{
            id:Number(messageId)
        },
        data:{
            text:text,
        }
        
    }); 
    
    res.json({msg:"updated",text:editMessage.text})
    } catch (error) {
        res.sendStatus(500);
    }

 }
export default {
    createMsg,
    editMessage
}