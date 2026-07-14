import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";
const userRotuer= Router();

userRotuer.get("/me", userController.getMe);
userRotuer.get("/suggestions",userController.getSugestedFollowing);
userRotuer.get("/:targetUserId/follow",userController.toggleFollowing);
userRotuer.get("/:userId", userController.getUserById);
export default userRotuer;