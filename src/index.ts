import "dotenv/config";

import express, { Application } from "express";

import cors from "./config/cors";
import { logger } from "./logger/logger";
import { endpointLogging } from "./middlewares/endpointLogging";
import { authRouter } from "./routes/authRouter";
// import { cartDetailsRouter } from "./routes/cartDetailsRouter";
// import { cartRouter } from "./routes/cartRouter";
// import { commentRouter } from "./routes/commentRouter";
import { experimentingRouter } from "./routes/experimentingRouter";
import { orderRouter } from "./routes/orderRouter";
// import { productDetailsRouter } from "./routes/productDetailsRouter";
import { productRouter } from "./routes/productRouter";
import { userRouter } from "./routes/userRouter";

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
  app.use("/users", userRouter);
  app.use("/products", productRouter);
  // app.use("/product/details", productDetailsRouter);
  // app.use("/comments", commentRouter);
  // app.use("/cart/details", cartDetailsRouter);
  // app.use("/cart", cartRouter);
  app.use("/orders", orderRouter);

  return app;
};

try {
  const serverInstance = server();
  serverInstance.listen(PORT, (): void => {
    logger.info(`Server started on port: ${PORT}`);
  });
} catch (error) {
  logger.error("Server crashed with error");
  logger.error(error);
}
