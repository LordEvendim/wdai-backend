import { Request, Response } from "express";

import { TypedRequest } from "../types/express";

const createAuthController = () => {
  return {
    getSession: (req: Request, res: Response) => {
      // TODO
    },
    login: async (req: Request, res: Response) => {
      // TODO
    },
    register: async (
      req: TypedRequest<{
        username: string;
        name: string;
        password: string;
        email: string;
      }>,
      res: Response<string>
    ) => {
      // TODO
    },
    logout: async (req: Request, res: Response) => {
      // TODO
    },
  };
};

export const authController = createAuthController();
