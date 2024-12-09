import { NextFunction, Request, Response } from "express";

import { logger } from "../logger/logger";

export const endpointLogging = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug(`${req.baseUrl + req.path}`);

  next();
};
