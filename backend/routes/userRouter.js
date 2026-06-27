import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";
const userRotuer= Router();

userRotuer.get("/me", authController.verifyJWT, userController.getMe)

export default userRotuer;