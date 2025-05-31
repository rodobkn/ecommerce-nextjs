"use server";

import { signIn } from "@/auth";

export const gitHubLogin = async () => {
  await signIn("github", {
    redirectTo: "/"
  })
}