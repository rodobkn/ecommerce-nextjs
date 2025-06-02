"use server";

import db from "@/clients/db";
import { CartItem } from "@/schema/cart-item";

export const addItemToCart = async (userId: string, newItem: CartItem): Promise<CartItem[]> => {
  const userSnapshot = await db.collection("users").doc(userId).get();

  if (!userSnapshot.exists) {
    throw new Error(`No se encontro el usuario con ID: ${userId}`)
  }

  const cart: CartItem[] = userSnapshot.data()?.cart || [];

  const existingItem = cart.find((item) => item.product.id === newItem.product.id);

  const updatedCart = existingItem
    ? cart.map((item) =>
        item.product.id === newItem.product.id
          ? {
              ...item,
              quantity: item.quantity + newItem.quantity,
              subtotal: item.subtotal + newItem.product.price * newItem.quantity,
            }
          : item
      )
    : [...cart, newItem];

  await db.collection("users").doc(userId).update({ cart: updatedCart });
  return updatedCart;
}
