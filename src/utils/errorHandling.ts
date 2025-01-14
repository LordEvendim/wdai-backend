import { Response } from "express";

import { logger } from "../logger/logger";

export const handleControllerError = (res: Response, error: unknown): void => {
  logger.error(error);
  
  if (!res.headersSent) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

