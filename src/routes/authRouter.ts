import express, { Router } from "express";
import { logoutController } from "src/controllers/logoutController";
import { refreshTokenController } from "src/controllers/refreshTokenController";

import { authController } from "../controllers/authController";

const router: Router = express.Router();

router.get("/", authController.getSession);
router.get("/refresh", refreshTokenController.handleRefreshToken);

router.post("/register", authController.register);
router.post("/login", authController.login);

router.delete("/logout", logoutController.handleLogout);

export { router as authRouter };
