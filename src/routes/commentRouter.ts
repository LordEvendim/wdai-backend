import express, { Router } from "express";

import { commentController } from "../controllers/commentController";

const router: Router = express.Router();

router.get("/", commentController.getAllComments);
router.get("/:commentId", commentController.getCommentById);
router.post("/", commentController.createComment);
router.put("/:commentId", commentController.updateCommentById);
router.delete("/:commentId", commentController.deleteCommentById);

export { router as commentRouter };
