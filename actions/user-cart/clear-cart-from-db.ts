"use server";

import db from "@/clients/db";

export const clearCartFromDb = async (userId: string): Promise<void> => {
  await db.collection("users").doc(userId).update({ cart: [] });
}
