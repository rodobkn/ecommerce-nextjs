import 'server-only';
import { CartItem } from "@/schema/cart-item";
import { Product } from "@/schema/product";
import db from "@/clients/db";

export const validateCartStock = async (cart: CartItem[]): Promise<boolean> => {
  const productsSnapshot = await db.collection("products").get();

  // Obtener los productos de la base de datos
  const productDb: Product[] = productsSnapshot.docs.map(
    (doc) => doc.data() as Product
  );

  // Validar el stock de cada producto en el carrito
  for (const item of cart) {
    const productInDb = productDb.find((prod) => prod.id === item.product.id);

    if (!productInDb || item.quantity > productInDb.stock) {
      return false; // Si algún producto no existe o no tiene suficiente stock, no es válido
    }
  }

  return true; // Todo el carrito es válido
};