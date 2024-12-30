import express, { Router } from "express";
import { verifyRole } from "src/middlewares/verifyRole";

import { orderController } from "../controllers/orderController";

const router: Router = express.Router();

router.get("/", verifyRole(["admin"]), orderController.getAllOrders);
router.get(
  "/:orderId",
  verifyRole(["user", "admin"]),
  orderController.getOrder
);
router.post("/", verifyRole(["user", "admin"]), orderController.createOrder);

export { router as orderRouter };
