import express, { Router } from "express";
import { verifyRole } from "src/middlewares/verifyRole";

import { commentController } from "../controllers/commentController";
import { productController } from "../controllers/productController";

const router: Router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);
router.get("/:category", productController.getProductsByCategory);
router.get("/:id/comments", commentController.getProductComments);
router.put("/:id", verifyRole(["admin"]), productController.updateProduct);

export { router as productRouter };
