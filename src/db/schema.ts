import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  user_id: integer().primaryKey(),
  username: text().notNull().unique(),
  role: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  refresh_token: text(),
});

export const products = sqliteTable("products", {
  product_id: integer().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  category: text().notNull(),
  price: real().notNull(),
  units_in_stock: integer().notNull(),
});

export const comments = sqliteTable("comments", {
  comment_id: integer().primaryKey({ autoIncrement: true }),
  product_id: integer()
    .references(() => products.product_id)
    .notNull(),
  user_id: integer()
    .references(() => users.user_id)
    .notNull(),
  body: text({ length: 256 }).notNull(),
});

export const orders = sqliteTable("orders", {
  order_id: integer().primaryKey(),
  user_id: integer()
    .references(() => users.user_id)
    .notNull(),
});

export const order_details = sqliteTable("order_details", {
  order_details_id: integer().primaryKey(),
  order_id: integer()
    .references(() => orders.order_id)
    .notNull(),
  product_id: integer()
    .references(() => products.product_id)
    .notNull(),
  quantity: integer().notNull(),
});
