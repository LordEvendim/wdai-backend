import express, { Router } from "express";

import { getAllOrders, getOrder } from "../controllers/orderController";

const router:Router = express.Router();

router.get("/", getAllOrders);
router.get("/:orderId", getOrder);

export { router as orderRouter };
