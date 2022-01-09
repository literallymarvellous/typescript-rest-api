import { object, string } from "yup";

const payload = {
  body: object({
    title: string().required("title is required"),
    body: string().required("Body is required"),
  }),
};

const params = {
  params: object({
    postId: string().required("postId si required"),
  }),
};

export const createPostSchema = object({
  ...payload,
});

export const updatePostSchema = object({
  ...params,
  ...payload,
});

export const deletePostSchema = object({
  ...params,
});
