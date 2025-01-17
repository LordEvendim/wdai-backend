import express, { Router } from "express";

import { commentController } from "../controllers/commentController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { verifyRole } from "../middlewares/verifyRole";

const router: Router = express.Router();

router.get("/", commentController.getAllComments);
router.get("/product/:productId", commentController.getProductComments);
router.get("/:commentId", commentController.getCommentById);
router.post(
  "/:productId",
  isAuthenticated,
  verifyRole(["admin", "user"]),
  commentController.createComment
);
router.put(
  "/:commentId",
  isAuthenticated,
  verifyRole(["user", "admin"]),
  commentController.updateCommentById
);
router.delete(
  "/:commentId",
  isAuthenticated,
  verifyRole(["admin", "user"]),
  commentController.deleteCommentById
);

export { router as commentRouter };
