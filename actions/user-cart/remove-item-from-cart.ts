"use server";

import db from "@/clients/db";
import { CartItem } from "@/schema/cart-item";

export const removeItemFromCart = async (userId: string, productId: string): Promise<CartItem[]> => {
  const userSnapshot = await db.collection("users").doc(userId).get();

  if (!userSnapshot.exists) {
    throw new Error(`No se encontro el usuario con ID: ${userId}`);
  }

  const cart: CartItem[] = userSnapshot.data()?.cart || [];

  const updatedCart = cart
    .map((item) => {
      if (item.product.id === productId) {
        if (item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
            subtotal: item.subtotal - item.product.price,
          };
        }
        return null; // Elimina el producto si la quantity es 1
      }
      return item;
    })
    .filter(Boolean) as CartItem[];

  await db.collection("users").doc(userId).update({ cart: updatedCart });
  return updatedCart;
}
