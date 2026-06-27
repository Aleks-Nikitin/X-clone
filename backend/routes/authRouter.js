import { Router } from "express";
import passport from "passport"
import authController from "../controllers/authController.js";
const authRotuer= Router();

authRotuer.get("/github",
     passport.authenticate('github',{scope:['user:email'],session:false})
)
authRotuer.get("/github/callback",
     passport.authenticate('github',{session:false,failureRedirect:`${process.env.FRONTEND_URL}/login?error=github_declined`}), 
    authController.authCallbackGithub);

export default authRotuer;