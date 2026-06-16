import { Router } from "express";
import userController from "../controllers/userController.js";
const userRotuer= Router();

userRotuer.get("/", userController.getUsers)

export default userRotuer;