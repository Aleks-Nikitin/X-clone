import { Router } from "express";
import refreshTokenController from "../controllers/refreshTokenController.js";
const refreshRouter = Router();

refreshRouter.get("/",refreshTokenController.handleRefreshToken);

export default refreshRouter;