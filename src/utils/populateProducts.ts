import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../db/schema";

dotenv.config();

const db = drizzle(process.env.DB_FILE_NAME!, { schema });
const productsTable = schema.products;

async function populateProducts() {
  console.log("Database file:", process.env.DB_FILE_NAME!);
  try {
    console.log("Fetching products from FakeStore API...");
    const response = await fetch("https://fakestoreapi.com/products?limit=100");
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const products = await response.json();
    console.log("Fetched products:", products);

    const transformedProducts = products.map((product: any) => ({
      name: product.title,
      category: product.category,
      description: product.description,
      price: product.price,
      units_in_stock: Math.floor(Math.random() * 100) + 1,
    }));

    console.log("Transformed Products:", transformedProducts);

    console.log("Inserting products into the database...");
    await db.insert(productsTable).values(transformedProducts);

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

populateProducts();
