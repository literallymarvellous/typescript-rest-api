import config from "config";
import {
  createAccessToken,
  createSession,
  findSessions,
  updateSession,
} from "./../service/session.service";
import { validatePassword } from "../service/user.service";
import { Request, Response } from "express";
import { sign } from "../utils/jwt.utils";
import { get } from "lodash";

export const createUserSessionHandler = async (req: Request, res: Response) => {
  // validate the email and password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }
  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create access token
  const accessToken = createAccessToken({ user, session });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"),
  });

  // send access & refresh token
  res.send({ accessToken, refreshToken });
};

export const invalidateUserSessionHandler = async (
  req: Request,
  res: Response
) => {
  const sessionId = get(req, "user.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
};

export const getUserSessionsHandler = async (req: Request, res: Response) => {
  const userId = get(req, "user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
};
