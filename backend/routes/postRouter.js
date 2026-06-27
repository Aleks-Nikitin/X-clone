import { Router } from 'express';
import postController from '../controllers/postController.js';
import authController from '../controllers/authController.js';
const postRouter=Router();

postRouter.get("/me",authController.verifyJWT,postController.getUserPosts);
postRouter.get("/:userId",postController.getPostsByAuthor)
postRouter.put("/:postId",authController.verifyJWT,postController.updatePost);
postRouter.post("/",authController.verifyJWT,postController.createPost);
postRouter.delete("/:postId",authController.verifyJWT,postController.deletePost);
export default postRouter;