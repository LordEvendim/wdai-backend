import { Request, Response } from "express";

import {
  CreateOrder,
  QueryOrderById,
  QueryOrders,
  QueryUserOrders,
} from "../services/ordersTable";
import { handleControllerError } from "../utils/errorHandling";

const createOrderController = () => {
  return {
    getOrder: async (req: Request, res: Response) => {
      try {
        const orderId = req.params.orderId;
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;

        const orders = await QueryOrderById(Number(orderId));
        const order = orders[0];

        // "Admin" can see any order
        if (userRole !== "admin" && order.userId !== Number(userId)) {
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
        console.log("getting orders");
        const orders = await QueryOrders();

        res.status(200).send(orders);
      } catch (error) {
        handleControllerError(res, error);
      }
    },
    getUserOrders: async (req: Request, res: Response) => {
      try {
        const userId = parseInt(req.params.userId);

        if (
          userId !== (req as any).user.id &&
          (req as any).user.role !== "admin"
        ) {
          res.status(403).send({ message: "You can only see your orders" });
          return;
        }

        const orders = await QueryUserOrders(Number(userId));

        res.status(200).send(orders);
      } catch (error) {
        handleControllerError(res, error);
      }
    },
    createOrder: async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const orderId = await CreateOrder(req.body, Number(userId));
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
