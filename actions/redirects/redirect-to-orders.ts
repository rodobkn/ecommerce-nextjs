"use server";

import { redirect } from "next/navigation";

export const redirectToOrders = () => {
  return redirect("/orders");
}
