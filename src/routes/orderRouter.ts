import express, { Router } from "express";

import { orderController } from "../controllers/orderController";

const router: Router = express.Router();

router.get("/", orderController.getAllOrders);
router.get("/:orderId", orderController.getOrder);
router.post("/", orderController.createOrder);

export { router as orderRouter };
