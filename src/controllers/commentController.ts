// import { Request, Response } from "express";

// export const getAllComments = (req: Request, res: Response) => {
//   const comments = QueryComments();

//   return res.json(comments);
// }

// export const getComment = (req: Request, res: Response) => {
//   const { commentId } = req.params;
//   const comment = QueryCommentById(commentId);

//   return res.json(comment);
// }

// export const createComment = (req: Request, res: Response) => {
//   const comment = CreateComment(req.body);

//   return res.json(comment);
// }

// export const updateComment = (req: Request, res: Response) => {
//   const { commentId } = req.params;
//   const comment = UpdateCommentById(commentId);

//   return res.json(comment);
// }

// export const deleteComment = (req: Request, res: Response) => {
//   const { commentId } = req.params;
//   const comment = DeleteCommentById(commentId);

//   return res.json(comment);
// }