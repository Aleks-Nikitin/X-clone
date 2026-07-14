import { Router } from 'express';
import postController from '../controllers/postController.js';
import authController from '../controllers/authController.js';
const postRouter=Router();

postRouter.get("/me",postController.getUserPosts);
postRouter.get("/",postController.getYourFeed)
postRouter.get("/following",postController.getPostsOfFollowing)
postRouter.get("/:postId/like",postController.toggleLike);
postRouter.get("/liked",postController.getLikedPosts);
postRouter.get("/:userId",postController.getPostsByAuthor)
postRouter.put("/:postId",postController.updatePost);
postRouter.post("/",postController.createPost);
postRouter.delete("/:postId",postController.deletePost);
export default postRouter;