import { Router } from "express";
import chatController from "../controllers/chatController.js";
const chatRouter =Router();
chatRouter.get("/:targetUserId",chatController.createOrFindChat);

export default chatRouter;