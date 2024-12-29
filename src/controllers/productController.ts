import { Request, Response } from "express";
import {
  QueryProductById,
  QueryProducts,
  QueryProductsByCategory,
  UpdateProduct,
} from "src/services/productTable";
import { handleControllerError } from "src/utils/errorHandling";

const createProductController = () => {
  return {
    getProduct: async (req: Request, res: Response) => {
      try {
        const { id: productId } = req.params;
        const product = await QueryProductById(Number(productId));

        res.status(200).send(product);
      } catch (error) {
        handleControllerError(res, error);
      }
    },
    getAllProducts: async (req: Request, res: Response) => {
      try {
        const products = await QueryProducts();

        res.status(200).send(products);
      } catch (error) {
        handleControllerError(res, error);
      }
    },

    getProductsByCategory: async (req: Request, res: Response) => {
      try {
        const { category } = req.params;
        const product = await QueryProductsByCategory(category);

        res.status(200).send(product);
      } catch (error) {
        handleControllerError(res, error);
      }
    },

    updateProduct: async (req: Request, res: Response) => {
      try {
        const productId = await UpdateProduct(req.params, req.body);

        res
          .status(201)
          .send({ message: "Product updated successfully", productId });
      } catch (error) {
        handleControllerError(res, error);
      }
    },
  };
};

export const productController = createProductController();
