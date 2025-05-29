"use server";

import { redirect } from "next/navigation";

export const redirectToLogin = () => {
  return redirect("/auth/login");
}