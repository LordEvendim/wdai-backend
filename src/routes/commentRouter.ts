import express, { Router } from "express";

import { commentController } from "../controllers/commentController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router: Router = express.Router();

router.get("/", commentController.getAllComments);
router.get("/:commentId", commentController.getCommentById);
router.post("/", commentController.createComment);
router.put("/:commentId", commentController.updateCommentById);
router.delete(
  "/:commentId",
  isAuthenticated,
  commentController.deleteCommentById
);

export { router as commentRouter };
