import express, { Router } from "express";

import { userController } from "../controllers/userController";
import { isAuthenticated } from "src/middlewares/isAuthenticated";
import { verifyRole } from "src/middlewares/verifyRole";

const router: Router = express.Router();

router.get(
  "/",
  isAuthenticated,
  verifyRole(["admin"]),
  userController.getUserInfo
);

export { router as userRouter };
