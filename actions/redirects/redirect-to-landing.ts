"use server";

import { redirect } from "next/navigation";

export const redirectToLanding = async () => {
  return redirect("/")
}
