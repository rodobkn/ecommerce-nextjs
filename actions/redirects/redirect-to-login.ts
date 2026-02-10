"use server";

import { redirect } from "next/navigation";

export const redirectToLogin = async () => {
  return redirect("/auth/login");
}