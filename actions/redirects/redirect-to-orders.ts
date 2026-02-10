"use server";

import { redirect } from "next/navigation";

export const redirectToOrders = async () => {
  return redirect("/orders");
}
