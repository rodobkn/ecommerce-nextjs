"use server";

import { redirect } from "next/navigation";

export const redirectToRegister = async () => {
  return redirect("/auth/register");
}