import { Request, Response } from "express";

import { handleControllerError } from "../utils/errorHandling";

interface UserInfo {
  id: number;
  email: string;
  role: string;
  credits: number;
}

const createUserController = () => {
  return {
    getUserInfo: async (req: Request, res: Response<UserInfo>) => {
      try {
        // TODO

        res.status(200).send({
          id: 1,
          email: "123@gmail.com",
          credits: 100,
          role: "admin",
        });
      } catch (error) {
        handleControllerError(res, error);
      }
    },
  };
};

export const userController = createUserController();
