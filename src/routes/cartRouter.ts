import express, { Router } from "express";

import { createCart, deleteCart } from "../controllers/cartController";

const router:Router = express.Router();

router.post("/", createCart);
router.delete("/:cartId", deleteCart);

export { router as cartRouter };
