import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../db/schema";
import { users } from "../db/schema";

const db = drizzle(process.env.DB_FILE_NAME!, { schema });
const comments = schema.comments;
const products = schema.products;

async function QueryComments() {
  const allComments = await db.select().from(comments);
  return allComments;
}

async function GetCommentById(commentId: number) {
  const existingComment = await db
    .select()
    .from(comments)
    .where(eq(comments.comment_id, commentId));

  if (existingComment.length === 0) {
    throw new Error("Comment does not exist.");
  }

  const comment = await db
    .select()
    .from(comments)
    .where(eq(comments.comment_id, commentId));
  return comment;
}

async function QueryCommentsByProduct(productId: number) {
  const existingProduct = await db
    .select()
    .from(products)
    .where(eq(products.product_id, productId));

  if (existingProduct.length === 0) {
    throw new Error("Product does not exist.");
  }

  const productComments = await db
    .select({
      comment_id: comments.comment_id,
      product_id: comments.product_id,
      user_id: comments.user_id,
      body: comments.body,
      username: users.username,
    })
    .from(comments)
    .leftJoin(users, eq(comments.user_id, users.user_id))
    .where(eq(comments.product_id, productId));

  return productComments;
}

// Allow for only one comment per user per product
async function CreateComment(productId: number, userId: number, text: string) {
  const existingProduct = await db
    .select()
    .from(products)
    .where(eq(products.product_id, productId));

  if (existingProduct.length === 0) {
    throw new Error("Product does not exist.");
  }

  const existingComment = await db
    .select()
    .from(comments)
    .where(
      and(eq(comments.user_id, userId), eq(comments.product_id, productId))
    );

  if (existingComment.length > 0) {
    throw new Error("You can only post one comment under a product.");
  }

  const comment = await db
    .insert(comments)
    .values({
      user_id: userId,
      product_id: productId,
      body: text,
    })
    .returning({ commentId: comments.comment_id });

  return comment;
}

// Allow users to only update their own comments
async function UpdateCommentById(commentId: number, userId: number, body: any) {
  const commentBody = body.text;

  const existingComment = await db
    .select()
    .from(comments)
    .where(eq(comments.comment_id, commentId));

  if (existingComment.length === 0) {
    throw new Error("Comment does not exist.");
  }
  if (existingComment[0].user_id !== userId) {
    throw new Error("You can only update your own comment.");
  }

  await db
    .update(comments)
    .set({ body: commentBody })
    .where(eq(comments.comment_id, commentId));

  return commentId;
}

async function UpdateCommentByUserProduct(body: any) {
  const commentId = body.comment_id;
  const commentBody = body.body;

  const existingProduct = await db
    .select()
    .from(comments)
    .where(eq(comments.comment_id, body.comment_id));

  if (existingProduct.length === 0) {
    throw new Error("Product does not exist.");
  }

  const existingComment = await db
    .select()
    .from(comments)
    .where(
      eq(
        comments.product_id,
        body.product_id && eq(comments.user_id, body.user_id)
      )
    );

  if (existingComment.length === 0) {
    throw new Error("Comment does not exist.");
  }

  await db
    .update(comments)
    .set({ body: commentBody })
    .where(eq(comments.comment_id, commentId));

  return commentId;
}

async function DeleteCommentById(
  commentId: number,
  userId: number,
  userRole: string
) {
  const existingComment = await db
    .select()
    .from(comments)
    .where(eq(comments.comment_id, commentId));

  if (existingComment.length === 0) {
    throw new Error("Comment does not exist.");
  }
  if (userRole !== "admin" && existingComment[0].user_id !== userId) {
    throw new Error("You can only delete your own comment.");
  }

  await db.delete(comments).where(eq(comments.comment_id, commentId));
  return commentId;
}

export {
  CreateComment,
  DeleteCommentById,
  GetCommentById,
  QueryComments,
  QueryCommentsByProduct,
  UpdateCommentById,
  UpdateCommentByUserProduct,
};
