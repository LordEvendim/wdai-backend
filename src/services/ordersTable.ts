import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../db/schema";
import { products } from "../db/schema";

const db = drizzle(process.env.DB_FILE_NAME!, { schema });
const orders = schema.orders;
const orderDetails = schema.order_details;

async function QueryOrders() {
  const allOrders = await db.select().from(orders);
  return allOrders;
}

async function QueryUserOrders(userId: number) {
  const userOrders = await db
    .select({
      orderId: orders.order_id,
      productId: orderDetails.product_id,
      quantity: orderDetails.quantity,
      productName: products.name,
      price: products.price,
    })
    .from(orders)
    .leftJoin(orderDetails, eq(orders.order_id, orderDetails.order_id))
    .leftJoin(products, eq(orderDetails.product_id, products.product_id))
    .where(eq(orders.user_id, userId));

  return userOrders;
}

async function QueryOrderById(orderId: number) {
  const order = await db
    .select({
      orderId: orders.order_id,
      userId: orders.user_id,
      productId: orderDetails.product_id,
      quantity: orderDetails.quantity,
      productName: products.name,
      price: products.price,
    })
    .from(orders)
    .leftJoin(orderDetails, eq(orders.order_id, orderDetails.order_id))
    .leftJoin(products, eq(orderDetails.product_id, products.product_id))
    .where(eq(orders.order_id, orderId));
  return order;
}
async function CreateOrder(body: any, userId: number) {
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
      .values({ user_id: userId })
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

export { CreateOrder, QueryOrderById, QueryOrders, QueryUserOrders };
