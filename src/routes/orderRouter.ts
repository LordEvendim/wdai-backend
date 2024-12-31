import express, { Router } from "express";
import { verifyRole } from "src/middlewares/verifyRole";

import { orderController } from "../controllers/orderController";
import { isAuthenticated } from "src/middlewares/isAuthenticated";

const router: Router = express.Router();

router.get(
  "/",
  isAuthenticated,
  verifyRole(["admin"]),
  orderController.getAllOrders
);
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
