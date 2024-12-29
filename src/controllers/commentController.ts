import { Request, Response } from "express";

import {
  CreateComment,
  DeleteCommentById,
  QueryCommentById,
  QueryComments,
  QueryCommentsByProduct,
  UpdateCommentById,
  UpdateCommentByUserProduct,
} from "../services/commentsTable";
import { handleControllerError } from "../utils/errorHandling";

const createCommentController = () => {
  return {
    getCommentById: async (req: Request, res: Response) => {
      try {
        const { id: commentId } = req.params;
        const comment = await QueryCommentById(Number(commentId));

        res.status(200).send(comment);
      } catch (error) {
        handleControllerError(res, error);
      }
    },
    getAllComments: async (req: Request, res: Response) => {
      try {
        const comments = await QueryComments();

        res.status(200).send(comments);
      } catch (error) {
        handleControllerError(res, error);
      }
    },

    getProductComments: async (req: Request, res: Response) => {
      try {
        const { productId } = req.params;
        const comments = await QueryCommentsByProduct(Number(productId));

        res.status(200).send(comments);
      } catch (error) {
        handleControllerError(res, error);
      }
    },

    createComment: async (req: Request, res: Response) => {
      try {
        const comment = await CreateComment(req.body);

        res.status(201).send("Succesfully created comment: " + comment);
      } catch (error) {
        handleControllerError(res, error);
      }
    },
    updateCommentById: async (req: Request, res: Response) => {
      try {
        const commentId = await UpdateCommentById(req.body);

        res
          .status(201)
          .send({ message: "Comment updated successfully", commentId });
      } catch (error) {
        handleControllerError(res, error);
      }
    },
    updateCommentByUserProduct: async (req: Request, res: Response) => {
      try {
        const comment = await UpdateCommentByUserProduct(req.body);
        res
          .status(201)
          .send({ message: "Comment updated successfully", comment });
      } catch (error) {
        handleControllerError(res, error);
      }
    },
    deleteCommentById: async (req: Request, res: Response) => {
      try {
        const { commentId } = req.body;
        const comment = await DeleteCommentById(Number(commentId));

        res
          .status(201)
          .send({ message: "Comment deleted successfully", comment });
      } catch (error) {
        handleControllerError(res, error);
      }
    },
  };
};

export const commentController = createCommentController();
