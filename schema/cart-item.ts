import { Product } from "@/schema/product";

export type CartProduct = Omit<Product, "stock" | "createdAt" | "updatedAt">;

export interface CartItem {
  product: CartProduct; // Producto Asociado
  quantity: number; // Cantidad del producto en el carrito
  subtotal: number; // Es igual al precio * quantity
}

