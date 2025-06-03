"use server";

import db from "@/clients/db";
import { CartItem } from "@/schema/cart-item";
import { Product } from "@/schema/product";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateUserCart = async (userId: string, clientCart: CartItem[]): Promise<ValidationResult> => {
  const userSnapshot = await db.collection("users").doc(userId).get();
  const productsSnapshot = await db.collection("products").get();

  if (!userSnapshot.exists) {
    return {
      isValid: false,
      errors: ["El usuario no existe."]
    }
  }

  const userDbCart: CartItem[] = userSnapshot.data()?.cart || [];
  const productsDb = productsSnapshot.docs.map((doc) => doc.data() as Product);

  let isValid = true;
  const errors: string[] = [];

  //Validar si el carrito del cliente coincide con el carrito de la base de datos del usuario
  if (JSON.stringify(clientCart) !== JSON.stringify(userDbCart)) {
    isValid = false;
    errors.push("El carrito local no coincide con el carridto almacenado en el servidor/base de datos.")
  }

  // Validar stock y existencia de productos
  clientCart.forEach((item) => {
    const product = productsDb.find((prod) => prod.id === item.product.id);

    if (!product) {
      isValid = false;
      errors.push(`El producto ${item.product.name} no existe en la base de datos.`);
      return;
    }

    if (item.quantity > product.stock) {
      isValid = false;
      errors.push(`El producto ${item.product.name} tiene stock insuficiente. (Disponible ${product.stock})`)
    }
  });

  return {
    isValid,
    errors,
  }
}
