import express, { Router } from "express";
import { verifyRole } from "src/middlewares/verifyRole";

import { commentController } from "../controllers/commentController";
import { productController } from "../controllers/productController";

const router: Router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:productId", productController.getProduct);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/:productId/comments", commentController.getProductComments);
router.put(
  "/:productId",
  verifyRole(["admin"]),
  productController.updateProduct
);


export { router as productRouter };
