import * as yup from "yup";

export const coachCreateValidate = yup.object({
  name: yup.string().required("Name is required"),

  birthdate: yup.date().required("Birthdate is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  schoolIds: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one school is required")
    .required(),
});

export const coachUpdateValidate = yup.object({
  name: yup.string(),

  birthdate: yup.date(),

  password: yup
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .notRequired(),

  schoolIds: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one school is required"),
});
export const coachLoginValidate = yup.object().shape({
    name: yup.string().required("Name is required").trim(),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export type TCoach = yup.InferType<typeof coachCreateValidate>;
export type TCoachUpdate = yup.InferType<typeof coachUpdateValidate>;
export type TCoachLogin = yup.InferType<typeof coachLoginValidate>;