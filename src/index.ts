import "dotenv/config";

import { drizzle } from "drizzle-orm/libsql";
import express, { Application } from "express";

import cors from "./config/cors";
import { logger } from "./logger/logger";
import { endpointLogging } from "./middlewares/endpointLogging";
import { authRouter } from "./routes/authRouter";
import { experimentingRouter } from "./routes/experimentingRouter";
import { productRouter } from "./routes/productRouter";
import { userRouter } from "./routes/userRouter";
import { commentRouter } from "./routes/commentRouter";
import { cartRouter } from "./routes/cartRouter";
import { cartDetailsRouter } from "./routes/cartDetailsRouter";
import { orderRouter } from "./routes/orderRouter";


const app: Application = express();
const PORT = 3000;

const server = () => {
  // Config
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors);

  app.use(endpointLogging);

  // Healthcheck
  app.get("/", (_req, res) => {
    res.status(200).send({ status: "ok" });
  });

  // Routes
  app.use("/exp", experimentingRouter);
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/comments", commentRouter);
  app.use("/cart", cartDetailsRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);

  return app;
};

const db = drizzle(process.env.DB_FILE_NAME!);

try {
  const serverInstance = server();
  serverInstance.listen(PORT, (): void => {
    logger.info(`Server started on port: ${PORT}`);
  });
} catch (error) {
  logger.error("Server crashed with error");
  logger.error(error);
}
