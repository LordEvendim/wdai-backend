import {Request, Response} from "express";

export const getAllOrders = (req: Request, res: Response) => {
  const orders = QueryOrders();
  
    // TODO
  return res.json(orders);
}

export const getOrder = (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = QueryOrderById(orderId); 
  
    // TODO
  return res.json(order);
}