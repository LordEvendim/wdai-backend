import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { getUserByRefreshToken } from "../services/usersTable";
import { handleControllerError } from "../utils/errorHandling";

const createRefreshTokenController = () => {
  return {
    handleRefreshToken: async (req: Request, res: Response): Promise<void> => {
      try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
          res
            .status(401)
            .send({ message: "Both username and password are required" });
          return;
        }

        const refreshToken = cookies.jwt;
        const foundUser = await getUserByRefreshToken(refreshToken);

        if (!foundUser || foundUser.length === 0) {
          res.status(403).send({ message: "Invalid Token" });
          return;
        }

        const user = foundUser[0];
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET!,
          (
            error: jwt.VerifyErrors | null,
            decoded: string | jwt.JwtPayload | undefined
          ) => {
            if (error || !decoded || typeof decoded === "string") {
              res.status(403).send({ message: "Invalid Token" });
              return;
            }

            if (user.username !== decoded.username) {
              res.status(403).send({ message: "Invalid Token" });
              return;
            }

            const accessToken = jwt.sign(
              { username: user.username },
              process.env.ACCESS_TOKEN_SECRET!,
              { expiresIn: "15m" }
            );

            res.status(200).send({ accessToken });
          }
        );
      } catch (error) {
        handleControllerError(res, error);
      }
    },
  };
};

export const refreshTokenController = createRefreshTokenController();
