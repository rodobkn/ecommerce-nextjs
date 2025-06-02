import { create } from "zustand";
import { CartItem } from "@/schema/cart-item";
import { fetchCartFromDb } from "@/actions/user-cart/fetch-cart-from-db";
import { addItemToCart } from "@/actions/user-cart/add-item-to-cart";
import { removeItemFromCart } from "@/actions/user-cart/remove-item-from-cart";
import { clearCartFromDb } from "@/actions/user-cart/clear-cart-from-db";

interface CartState {
  items: CartItem[],
  totalAmount: number,
  totalItems: number;
  isLoading: boolean;
  fetchCart: (userId: string) => Promise<void>; // Cargar carrito del usuario desde Firestore
  addItem: (userId: string, item: CartItem) => Promise<void>; // Agregar al carrito del usuario un Item
  removeItem: (userId: string, productId: string) => Promise<void> // Remover Item del carrito del usuario
  clearCart: (userId: string) => Promise<void>; // Vaciar el carrito del usuario
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isLoading: false,

  fetchCart: async (userId) => {
    set({ isLoading: true });
    try {
      const userCart = await fetchCartFromDb(userId);
      const totalAmount = userCart.reduce((sum: number, item: CartItem) => sum + item.subtotal, 0);
      const totalItems = userCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      set({ items: userCart, totalAmount, totalItems });
    } catch (error) {
      console.error("Error fetching cart: ", error);
    } finally {
      set({ isLoading: false })
    }
  },

  addItem: async (userId, newItem) => {
    set({ isLoading: true });
    try {
      const updatedCart = await addItemToCart(userId, newItem);
      const totalAmount = updatedCart.reduce((sum, item) => sum + item.subtotal, 0);
      const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      set({ items: updatedCart, totalAmount, totalItems })
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (userId, productId) => {
    set({ isLoading: true });
    try {
      const updatedCart = await removeItemFromCart(userId, productId);
      const totalAmount = updatedCart.reduce((sum, item) => sum + item.subtotal, 0);
      const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      set({ items: updatedCart, totalAmount, totalItems })
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async(userId) => {
    set({ isLoading: true });
    try {
      await clearCartFromDb(userId);
      set({ items: [], totalAmount: 0, totalItems: 0 });
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}))

