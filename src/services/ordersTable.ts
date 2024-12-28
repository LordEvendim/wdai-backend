import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../db/schema";

const db = drizzle(process.env.DB_FILE_NAME!, { schema });
const orders = schema.orders;
const orderDetails = schema.order_details;

async function QueryOrders() {
  const allOrders = await db.select().from(orders);
  return allOrders;
}

async function QueryOrderById(orderId: number) {
  const order = await db
    .select({
      productID: orderDetails.product_id,
      quantity: orderDetails.quantity,
    })
    .from(orderDetails)
    .where(eq(orderDetails.order_id, orderId));
  return order;
}

// async function CreateOrder(body: any) {
//   const order = await db
//     .insert(schema.orders)
//     .values({ user_id: body.user_id })
//     .returning({ order_id: orders.order_id });
//   const orderId = order[0].order_id;
//   await db.insert(orderDetails).values({
//     order_id: orderId,
//     product_id: body.product_id,
//     quantity: body.quantity,
//   });
//   return orderId;
// }

async function CreateOrder(body: any) {
  const transaction = await db.transaction(async (tx) => {
    // 1. Check stock for all products in the order
    const productIds = body.products.map((product: any) => product.product_id);
    const quantities = body.products.reduce(
      (acc: Record<number, number>, product: any) => {
        acc[product.product_id] = product.quantity;
        return acc;
      },
      {}
    );

    const productsInStock = await tx
      .select({
        product_id: schema.products.product_id,
        units_in_stock: schema.products.units_in_stock,
      })
      .from(schema.products)
      .where(inArray(schema.products.product_id, productIds));

    // Check stock availability
    for (const product of productsInStock) {
      const requestedQuantity = quantities[product.product_id];
      if (product.units_in_stock < requestedQuantity) {
        throw new Error(
          `Insufficient stock for product_id: ${product.product_id}`
        );
      }
    }

    // 2. Deduct stock for all products
    for (const product of productsInStock) {
      const requestedQuantity = quantities[product.product_id];
      await tx
        .update(schema.products)
        .set({
          units_in_stock: product.units_in_stock - requestedQuantity,
        })
        .where(eq(schema.products.product_id, product.product_id));
    }

    // 3. Insert order
    const [order] = await tx
      .insert(schema.orders)
      .values({ user_id: body.user_id })
      .returning({ order_id: schema.orders.order_id });

    const orderId = order.order_id;

    // 4. Insert order details
    const orderDetailsData = body.products.map((product: any) => ({
      order_id: orderId,
      product_id: product.product_id,
      quantity: product.quantity,
    }));

    await tx.insert(orderDetails).values(orderDetailsData);
    return orderId;
  });
  return transaction;
}

export { CreateOrder, QueryOrderById, QueryOrders };
