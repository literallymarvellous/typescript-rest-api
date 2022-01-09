import { object, string, ref } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required("name is required"),
    password: string()
      .required("password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "password can only Latin letters."),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "passwords must match"
    ),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});
