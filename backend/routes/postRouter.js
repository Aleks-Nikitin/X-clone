import { Router } from 'express';
import postController from '../controllers/postController.js';
import authController from '../controllers/authController.js';
const postRouter=Router();

postRouter.get("/me",postController.getUserPosts);
postRouter.get("/:userId",postController.getPostsByAuthor)
postRouter.put("/:postId",postController.updatePost);
postRouter.post("/",postController.createPost);
postRouter.delete("/:postId",postController.deletePost);
export default postRouter;