import { Request, Response } from "express";

import { getUserById } from "../services/usersTable";
import { handleControllerError } from "../utils/errorHandling";

const createUserController = () => {
  return {
    getUserInfo: async (req: Request, res: Response) => {
      try {
        const userId = req.params.userId;

        const userInfo = await getUserById(Number(userId));

        res.status(200).send(userInfo);
      } catch (error) {
        handleControllerError(res, error);
      }
    },
  };
};

export const userController = createUserController();
