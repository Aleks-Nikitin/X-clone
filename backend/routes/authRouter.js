import { Router } from "express";
import passport, { session } from "passport"
import authController from "../controllers/authController.js";
const authRotuer= Router();

authRotuer.get("/github/",
     passport.authenticate('github',{scope:['user:email'],session:false})
)
authRotuer.get("/github/callback",
     passport.authenticate('github',{session:false,failureRedirect:"http://localhost:5173/error"}), 
    authController.authCallbackGithub);

export default authRotuer;