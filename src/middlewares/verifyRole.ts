import { NextFunction, Request, Response } from "express";

import { handleControllerError } from "../utils/errorHandling";

export const verifyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = (req as any).user?.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        res.status(403).send({
          message: "Unauthorized",
        });
        return;
      }
      next();
    } catch (error) {
      handleControllerError(res, error);
    }
  };
};
