import express, { Router } from "express";

import { commentController } from "../controllers/commentController";
import { productController } from "../controllers/productController";

const router: Router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);
router.get("/:category", productController.getProductsByCategory);
router.get("/:id/comments", commentController.getProductComments);
router.put("/:id", productController.updateProduct);
router.put("/:id", commentController.updateCommentByUserProduct);

export { router as productRouter };
