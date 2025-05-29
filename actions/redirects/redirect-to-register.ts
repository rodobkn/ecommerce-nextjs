"use server";

import { redirect } from "next/navigation";

export const redirectToRegister = () => {
  return redirect("/auth/register");
}