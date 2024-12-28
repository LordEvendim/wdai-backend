import { Request, Response } from "express";

import {
  CreateOrder,
  QueryOrderById,
  QueryOrders,
} from "../services/ordersTable";
import { handleControllerError } from "../utils/errorHandling";

// const getAllOrders = async (req: Request, res: Response) => {
//   try {
//     const orders = await QueryOrders(); // Await the asynchronous function
//     return res.json(orders); // Respond with the result
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to fetch orders" });
//   }
// };

// const getOrder = async (req: Request, res: Response) => {
//   try {
//     const { orderId } = req.params;
//     const order = await QueryOrderById(Number(orderId)); // Await the asynchronous function

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     return res.json(order); // Respond with the result
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to fetch the order" });
//   }
// };

const createOrderController = () => {
  return {
    getOrder: async (req: Request, res: Response) => {
      try {
        const { orderId } = req.params;
        const order = await QueryOrderById(Number(orderId));

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
