import { Request, Response } from "express";

import {
  CreateComment,
  DeleteCommentById,
  GetCommentById,
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
        const { commentId } = req.params;

        const comment = await GetCommentById(Number(commentId));

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
        const userId = (req as any).user.id;
        const productId = req.params.productId;
        const text = req.body.text;

        if (!text) {
          throw new Error("Comment text is required");
        }

        const comment = await CreateComment(
          Number(productId),
          Number(userId),
          text
        );

        res
          .status(201)
          .send("Succesfully created comment with ID: " + comment[0].commentId);
      } catch (error) {
        handleControllerError(res, error);
      }
    },
    updateCommentById: async (req: Request, res: Response) => {
      try {
        const commentId = req.params.commentId;
        const userId = (req as any).user.id;
        const comment = await UpdateCommentById(
          Number(commentId),
          Number(userId),
          req.body
        );

        res
          .status(201)
          .send({ message: "Comment updated successfully", comment });
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
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;
        const commentId = req.params.commentId;

        const comments = await GetCommentById(Number(commentId));
        const comment = comments[0];

        if (!comment) {
          res.status(404).send({ message: "Comment not found" });
          return;
        }

        // "Admin" can delete any comment; "User" can delete only his own comment
        if (userRole !== "admin" && comment.user_id !== userId) {
          res.status(403).send({ message: "Unauthorized" });
          return;
        }

        await DeleteCommentById(Number(commentId), userId, userRole);
        res.status(200).send({ message: "Comment deleted successfully" });
      } catch (error) {
        handleControllerError(res, error);
      }
    },
  };
};

export const commentController = createCommentController();
