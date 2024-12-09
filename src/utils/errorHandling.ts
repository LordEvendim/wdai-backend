import { Response } from "express";

import { logger } from "../logger/logger";

export const handleControllerError = (res: Response, error: unknown) => {
  logger.error(error);

  if (error instanceof Error) return res.status(500).send(error.message);

  return res.status(500).send("Server error");
};
