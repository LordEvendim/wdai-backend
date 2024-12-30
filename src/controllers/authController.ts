import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  createUser,
  getUserByUsername,
  updateUser,
} from "../services/usersTable";
import { handleControllerError } from "../utils/errorHandling";

const createAuthController = () => {
  return {
    register: async (req: Request, res: Response): Promise<void> => {
      try {
        const body = req.body;
        const username = body.username;
        const password = body.password;
        const email = body.email;
        const role = body.role || "user";

        if (!username || !password) {
          res
            .status(400)
            .send({ message: "Both username and password are required" });
          return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({
          username,
          password: hashedPassword,
          email,
          role,
        });

        res
          .status(201)
          .send({ message: "User registered successfully", newUser });
      } catch (error) {
        handleControllerError(res, error);
      }
    },

    login: async (req: Request, res: Response): Promise<void> => {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          res
            .status(400)
            .send({ message: "Both username and password are required" });
          return;
        }

        const foundUser = await getUserByUsername(username);

        if (!foundUser || foundUser.length === 0) {
          res.status(401).send({ message: "Invalid credentials" });
          return;
        }

        const user = foundUser[0];
        const match = await bcrypt.compare(password, user.password);

        if (
          !process.env.ACCESS_TOKEN_SECRET ||
          !process.env.REFRESH_TOKEN_SECRET
        ) {
          throw new Error(
            "Token secrets are not defined in environment variables"
          );
        }

        if (match) {
          // Create Access Token
          const accessToken = jwt.sign(
            { userId: user.user_id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "1h" }
          );

          // Create Refresh Token
          const refreshToken = jwt.sign(
            { userId: user.user_id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "1d" }
          );

          // Save Refresh Token to the database
          await updateUser(user.user_id, { refresh_token: refreshToken });

          // Send Refresh Token as a cookie
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
          });

          // Send tokens to the client
          res.status(200).send({
            message: "Login successful",
            accessToken,
          });
        } else {
          res.status(401).send({ message: "Invalid credentials" });
        }
      } catch (error) {
        handleControllerError(res, error);
      }
    },
  };
};

export const authController = createAuthController();
