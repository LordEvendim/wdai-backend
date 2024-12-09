import express, { Request, Response, Router } from "express";
import { logger } from "src/logger/logger";

import { handleControllerError } from "../utils/errorHandling";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    // TESTING
    logger.info("This is a test log message");

    res.send({});
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
});

export { router as experimentingRouter };
