import 'server-only';
import { CartItem } from "@/schema/cart-item";

/**
 * Compara el carrito enviado desde el cliente con el carrito almacenado en la base de datos.
 * Verifica id de producto, cantidad, precio y subtotal por producto.
 */
export const validateCartIntegrity = (
  clientCart: CartItem[],
  dbCart: CartItem[]
): boolean => {
  // Verificar largo del carrito
  if (clientCart.length !== dbCart.length) return false;

  for (const item of clientCart) {
    const matchingItem = dbCart.find(
      (dbItem) => dbItem.product.id === item.product.id
    );

    if (!matchingItem) return false;

    if (item.quantity !== matchingItem.quantity) return false;

    if (item.product.price !== matchingItem.product.price) return false;

    const expectedSubtotal = matchingItem.product.price * matchingItem.quantity;
    if (item.subtotal !== expectedSubtotal) return false;
  }

  return true;
};
