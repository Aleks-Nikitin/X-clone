import { Router } from "express";
import commentController from "../controllers/commentController.js";
import authController from "../controllers/authController.js";
const commentRouter =Router();
commentRouter.post("/:postId",commentController.createComment)
commentRouter.get("/users/:userId",commentController.getCommentsByUser)
commentRouter.get("/:postId",commentController.getCommentsByPost)
commentRouter.put("/:commentId",commentController.updateComment)
commentRouter.delete("/:commentId",commentController.deleteComment)
export default commentRouter;