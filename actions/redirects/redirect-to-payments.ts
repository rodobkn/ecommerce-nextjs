"use server";

import { redirect } from "next/navigation";

export const redirectToPayments = async () => {
  return redirect("/payments");
}
