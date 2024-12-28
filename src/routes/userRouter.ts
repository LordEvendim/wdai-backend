import express, { Router } from "express";

import { userController } from "../controllers/userController";

const router: Router = express.Router();

router.get("", userController.getUserInfo);
// router.post("/:userId", createUser);

export { router as userRouter };
