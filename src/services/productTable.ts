import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../db/schema";

const db = drizzle(process.env.DB_FILE_NAME!, { schema });
const products = schema.products;

async function QueryProducts() {
  const allProducts = await db.select().from(products);
  return allProducts;
}

async function QueryProductById(productId: number) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.product_id, productId));
  return product;
}

async function QueryProductsByCategory(category: any) {
  const productCategory = await db
    .select()
    .from(products)
    .where(eq(products.category, category));

  if (productCategory.length === 0) {
    throw new Error("Product category does not exist.");
  }

  const product = await db
    .select()
    .from(products)
    .where(eq(products.category, category));
  return product;
}

const UpdateProduct = async (product_id: any, body: any) => {
  const { ...updateFields } = body;
  const productId = product_id.id;

  if (!productId) {
    throw new Error("Product ID is required for updates");
  }

  if (Object.keys(updateFields).length === 0) {
    throw new Error("No fields provided to update");
  }

  await db
    .update(products)
    .set(updateFields)
    .where(eq(products.product_id, productId));

  return productId;
};

export {
  QueryProductById,
  QueryProducts,
  QueryProductsByCategory,
  UpdateProduct,
};
