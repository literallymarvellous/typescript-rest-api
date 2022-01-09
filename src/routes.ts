import { createSesssionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";
import { Express, Request, Response } from "express";
import { createUserHandler } from "./controller/user.controller";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  invalidateUserSessionHandler,
} from "./controller/session.controller";
import { requireUser, validateRequest } from "./middleware";
import {
  createPostSchema,
  deletePostSchema,
  updatePostSchema,
} from "./schema/post.schema";
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  updatePostHandler,
} from "./controller/post.controller";

export default function (app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  // register user
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

  // login
  app.post(
    "/api/sessions",
    validateRequest(createSesssionSchema),
    createUserSessionHandler
  );

  // Get the user's sessions
  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  // logout
  app.delete("/api/sessions", requireUser, invalidateUserSessionHandler);

  // create a post
  app.post(
    "/api/posts",
    [requireUser, validateRequest(createPostSchema)],
    createPostHandler
  );

  // Update a post
  app.put(
    "/api/posts/:postId",
    [requireUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );

  // get a post
  app.get("/api/posts/:postId", getPostHandler);

  // Delete a post
  app.delete(
    "/api/posts/:postId",
    [requireUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
}
