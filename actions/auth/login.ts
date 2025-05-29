"use server";

import * as z from "zod";

import { LoginType } from "@/validation-types/auth-types";
import { signIn } from "@/auth";

export const login = async (
  values: z.infer<typeof LoginType>
) => {
  const validateFields = LoginType.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields!" }
  }

  await signIn("credentials", {
    email: values.email,
    password: values.password,
    redirectTo: "/"
  })
}
