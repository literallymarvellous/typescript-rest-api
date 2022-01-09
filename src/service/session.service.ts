import { FilterQuery, FlattenMaps, LeanDocument, UpdateQuery } from "mongoose";
import { UserDocument } from "./../model/user.model";
import Session, { SessionDocument } from "../model/session.model";
import config from "config";
import { decode, sign } from "../utils/jwt.utils";
import { get } from "lodash";
import { findUser } from "./user.service";

export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });

  return session.toJSON();
};

export const createAccessToken = ({
  user,
  session,
}: {
  user:
    | false
    | Pick<
        FlattenMaps<
          LeanDocument<
            UserDocument & {
              _id: any;
            }
          >
        >,
        | "_id"
        | "__v"
        | "id"
        | "name"
        | "createdAt"
        | "updateAt"
        | "email"
        | "comparePassword"
      >;
  session: FlattenMaps<
    LeanDocument<
      SessionDocument & {
        _id: any;
      }
    >
  >;
}) => {
  // Build and return access token
  const accessToken = sign(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  return accessToken;
};

// Re isuue an new access token
export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  // Decode refresh token
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, "_id")) return false;

  // get the seesion
  const session = await Session.findById(get(decoded, "_id"));

  //Make sure the seesion is still valid
  if (!session || !session?.valid) return false;

  const user = await findUser({ id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
};

export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => Session.updateOne(query, update);

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  return Session.find(query).lean();
};
