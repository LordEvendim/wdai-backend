import express, { Router } from "express";

import { authController } from "../controllers/authController";

const router: Router = express.Router();

router.get("/", authController.getSession);
router.delete("/logout", authController.logout);

router.post("/login", authController.login);
router.post("/register", authController.register);

export { router as authRouter };
