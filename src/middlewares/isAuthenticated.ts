import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { handleControllerError } from "../utils/errorHandling";

dotenv.config();

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.Authorization ||
      (req.headers.authorization as string | undefined);
    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      res.status(401).send("Authorization error");
      return;
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
      if (err) {
        res.status(403).send("Authorization error");
        return;
      }

      if (
        decoded &&
        typeof decoded !== "string" &&
        "username" in decoded.UserInfo
      ) {
        (req as any).user = decoded.UserInfo;
      }
    });
    next();
  } catch (error) {
    handleControllerError(res, error);
  }
};
