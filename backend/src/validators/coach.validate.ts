import * as yup from "yup";

export const coachValidate = yup.object().shape({
    name: yup.string().required("Name is required").trim(),
    schoolIds: yup.array().of(yup.string().required()).min(1, "At least one School ID is required"),
    birthdate: yup.date().required("Birthdate is required").max(new Date(), "Birthdate cannot be in the future"),

});

export type TCoach = yup.InferType<typeof coachValidate>;