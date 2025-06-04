"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterType } from "@/validation-types/auth-types";
import { signIn } from "@/auth";
import db from "@/clients/db";
import { User, RegistrationMethod } from "@/schema/user";

// server function action
export const register = async (
  values: z.infer<typeof RegisterType>
) => {
  const validateFields = RegisterType.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalidad fields!" }
  }

  const email = values.email.toLowerCase();

  const userSnapshot = await db.collection("users").where("email", "==", email).get();
  if (!userSnapshot.empty) {
    return { error: "Ya esta usado el email" }
  }

  const hashedPassword = await bcrypt.hash(values.password, 10);

  const newUser: User = {
    id: "",
    email: email,
    name: values.name,
    hashedPassword,
    registrationMethod: RegistrationMethod.INTERNAL,
    cart: [],
    updatedAt: new Date(),
    createdAt: new Date(),
  }

  const userRef = db.collection("users").doc();
  newUser.id = userRef.id;
  await userRef.set(newUser);

  await signIn("credentials", {
    email: email,
    password: values.password,
    redirectTo: "/"
  })
}
