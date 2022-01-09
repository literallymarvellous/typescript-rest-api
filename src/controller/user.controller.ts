import { Express, Request, Response } from "express";
import { omit } from "lodash";
import log from "../logger";
import { createUser } from "./../service/user.service";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (e: any | undefined) {
    log.error(e);
    return res.status(400).send(e.message);
  }
};
