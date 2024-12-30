import express, { Router } from "express";
import { logoutController } from "src/controllers/logoutController";
import { refreshTokenController } from "src/controllers/refreshTokenController";

import { authController } from "../controllers/authController";

const router: Router = express.Router();

// router.get("/", authController.getSession);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", logoutController.handleLogout);
router.get("/refresh", refreshTokenController.handleRefreshToken);

export { router as authRouter };
