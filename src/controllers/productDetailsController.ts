import { Request, Response } from "express";

export const getAllProductsDetails = (req: Request, res: Response) => {
  const products = QueryProductsDetails();

  return res.json(products)
}

export const getProductDetails = (req: Request, res: Response) => {
  const { id } = req.params;
  const product = QueryProductDetailsById(id);

  return res.json(product)
}

export const updateProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const product = UpdateProductById(id);

  return res.json(product)
}
