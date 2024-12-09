import express, { Router } from "express";

import { userController } from "../controllers/userController";

const router: Router = express.Router();

router.get("/:userId", userController.getUserInfo);

export { router as userRouter };
