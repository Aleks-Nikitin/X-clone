import { Router } from "express";
import chatController from "../controllers/chatController.js";
import messageController from "../controllers/messageController.js";
const chatRouter =Router();
chatRouter.get("/:targetUserId",chatController.createOrFindChat);
chatRouter.post("/:chatId/messages",messageController.createMsg);
chatRouter.put("/messages/:messageId",messageController.editMessage);
export default chatRouter;