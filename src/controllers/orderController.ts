import { Request, Response } from "express";

import {
  CreateOrder,
  QueryOrderById,
  QueryOrders,
} from "../services/ordersTable";
import { handleControllerError } from "../utils/errorHandling";

const createOrderController = () => {
  return {
    getOrder: async (req: Request, res: Response) => {
      try {
        const orderId = req.params;
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;

        const orders = await QueryOrderById(Number(orderId));
        const order = orders[0];

        // "Admin" can see any comment; "User" can see only their own comment
        if (userRole !== "admin" && order.user_id !== Number(userId)) {
          res.status(403).send({ message: "Unauthorized" });
          return;
        }

        res.status(200).send(order);
      } catch (error) {
        handleControllerError(res, error);
      }
    },
    getAllOrders: async (req: Request, res: Response) => {
      try {
        const orders = await QueryOrders();

        res.status(200).send(orders);
      } catch (error) {
        handleControllerError(res, error);
      }
    },
    createOrder: async (req: Request, res: Response) => {
      try {
        const orderId = await CreateOrder(req.body);

        res
          .status(200)
          .send({ message: "Order created successfully", orderId });
      } catch (error) {
        handleControllerError(res, error);
      }
    },
  };
};

export const orderController = createOrderController();
