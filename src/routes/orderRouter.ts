import express, { Router } from "express";
import { isAuthenticated } from "src/middlewares/isAuthenticated";
import { verifyRole } from "src/middlewares/verifyRole";

import { orderController } from "../controllers/orderController";

const router: Router = express.Router();

router.get(
  "/",
  isAuthenticated,
  verifyRole(["admin"]),
  orderController.getAllOrders
);
router.get("/users/:userId", isAuthenticated, orderController.getUserOrders);
router.get(
  "/:orderId",
  isAuthenticated,
  verifyRole(["user", "admin"]),
  orderController.getOrder
);
router.post(
  "/",
  isAuthenticated,
  verifyRole(["user", "admin"]),
  orderController.createOrder
);

export { router as orderRouter };
