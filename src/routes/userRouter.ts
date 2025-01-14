import express, { Router } from "express";
import { isAuthenticated } from "src/middlewares/isAuthenticated";
import { verifyRole } from "src/middlewares/verifyRole";

import { userController } from "../controllers/userController";

const router: Router = express.Router();

router.get(
  "/:userId",
  isAuthenticated,
  verifyRole(["admin"]),
  userController.getUserInfo
);

export { router as userRouter };
