import { Request, Response } from "express";

import { getUserByRefreshToken, updateUser } from "../services/usersTable";
import { handleControllerError } from "../utils/errorHandling";

const createLogoutController = () => {
  return {
    handleLogout: async (req: Request, res: Response): Promise<void> => {
      try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
          res.status(204).send({ message: "No content" });
          return;
        }

        const refreshToken = cookies.jwt;
        const foundUser = await getUserByRefreshToken(refreshToken);

        if (!foundUser || foundUser.length === 0) {
          // Clear the cookie even if the user is not found
          res.clearCookie("jwt", {
            httpOnly: true,
            secure: false,
            sameSite: "none",
          });
          res.status(204).send({ message: "User not found" });
          return;
        }

        const user = foundUser[0];

        // Delete the refresh token from the database
        await updateUser(user.user_id, { refresh_token: null });

        // Clear the cookie
        res.clearCookie("jwt", {
          httpOnly: true,
          secure: false,
          sameSite: "none",
        });

        // Send the response after clearing the cookie
        res.status(200).send({ message: "Logout successful" });
      } catch (error) {
        handleControllerError(res, error);
      }
    },
  };
};

export const logoutController = createLogoutController();
