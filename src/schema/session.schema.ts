import { object, string } from "yup";

export const createSesssionSchema = object({
  body: object({
    password: string()
      .required("password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "password can only Latin letters."),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});
