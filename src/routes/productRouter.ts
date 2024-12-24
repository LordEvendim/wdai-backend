import express, { Router } from "express";

import { getAllProducts, getProduct } from "../controllers/productController";

const router: Router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);

export { router as productRouter };
