"use server";

import db from "@/clients/db";
import { CartItem } from "@/schema/cart-item";

export const fetchCartFromDb = async (userId: string): Promise<CartItem[]> => {
  const userSnapshot = await db.collection("users").doc(userId).get();

  if (!userSnapshot.exists) {
    throw new Error(`No se encontró el usuario con ID: ${userId}`)
  }

  const userCart = userSnapshot.data()?.cart || [];
  return userCart;
}
