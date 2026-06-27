import {prisma} from "../lib/prisma.js"
async function createOrFindChat(req,res) {
    try {
   const myId = Number(req.user);
    const targetUserId = Number(req.params.targetUserId);

    if (!Number.isInteger(myId) || !Number.isInteger(targetUserId)) {
      return res.status(400).json({ msg: "Invalid user ids" });
    }

     if (myId === targetUserId) {
    return res.status(400).json({ msg: "Cannot create chat with same user" });
  }
  const existingChat = await prisma.chat.findFirst({
    where: {
      AND: [
        { users: { some: { id: myId } } },
        { users: { some: { id: targetUserId } } },
      ],
    },
    include: {
      messages: true,
    },
  });

  if (existingChat) {
    return res.json({
      msg: "chat exists",
      chatId: existingChat.id,
      targetUserId: targetUserId,
      messages: existingChat.messages,
    });
  }

  const created = await prisma.chat.create({
    data: {
      users: {
        connect: [{ id: myId }, { id: targetUserId }],
      },
    },
    include: {
      messages: true,
    },
  });
   return res.status(201).json({
    msg: "chat created",
    chatId: created.id,
    targetUserId: targetUserId,
    messages: created.messages,
  });
    } catch (error) {
        return res.sendStatus(500);
    }
  
}

export default {
    createOrFindChat
}