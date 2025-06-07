"use server";

import { redirect } from "next/navigation";

export const redirectToPayments = () => {
  return redirect("/payments");
}
