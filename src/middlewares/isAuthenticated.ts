import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"] as string | undefined;
    if (!authHeader) {
      return res.status(401).send("Authorization error");
    }
    console.log("authHeader", authHeader);
    const token = authHeader.split(" ")[1];
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      (err, decoded: string | jwt.JwtPayload | undefined) => {
        if (err) {
          return res.status(403).send("Authorization error");
        }
        console.log("decoded", decoded);
        if (decoded && typeof decoded !== "string" && "username" in decoded) {
          (req as any).user = decoded.username;
        }
      }
    );
    return next();
  } catch (error: unknown) {
    return error instanceof Error
      ? res.status(500).send(error.message)
      : res.status(500).send("Authorization error");
  }
};

module.exports = isAuthenticated;
