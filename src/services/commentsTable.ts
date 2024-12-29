import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../db/schema";

const db = drizzle(process.env.DB_FILE_NAME!, { schema });
const comments = schema.comments;
const products = schema.products;

async function QueryComments() {
  const allComments = await db.select().from(comments);
  return allComments;
}

async function QueryCommentById(body: any) {
  const commentId = body.comment_id;

  const existingComment = await db
    .select()
    .from(comments)
    .where(eq(comments.comment_id, body.comment_id));

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
    .select()
    .from(comments)
    .where(eq(comments.product_id, productId));
  return productComments;
}

// Allow for only one comment per user per product
async function CreateComment(body: any) {
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
      eq(comments.user_id, body.user_id) &&
        eq(comments.product_id, body.product_id)
    );

  if (existingComment.length > 0) {
    throw new Error("You can only post one comment under a product.");
  }

  const comment = await db
    .insert(comments)
    .values({
      user_id: body.user_id,
      product_id: body.product_id,
      body: body.body,
    })
    .returning({ comment_id: comments.comment_id });

  return { comment };
}

async function UpdateCommentById(body: any) {
  const commentId = body.comment_id;
  const commentBody = body.body;

  const existingComment = await db
    .select()
    .from(comments)
    .where(eq(comments.comment_id, body.comment_id));

  if (existingComment.length === 0) {
    throw new Error("Comment does not exist.");
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

async function DeleteCommentById(body: any) {
  const commentId = body.comment_id;

  const existingComment = await db
    .select()
    .from(comments)
    .where(eq(comments.comment_id, body.comment_id));

  if (existingComment.length === 0) {
    throw new Error("Comment does not exist.");
  }

  await db.delete(comments).where(eq(comments.comment_id, commentId));
}

export {
  CreateComment,
  DeleteCommentById,
  QueryCommentById,
  QueryComments,
  QueryCommentsByProduct,
  UpdateCommentById,
  UpdateCommentByUserProduct,
};
