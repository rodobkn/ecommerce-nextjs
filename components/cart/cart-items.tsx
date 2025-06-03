"use client";

import { useCartStore } from "@/stores/cart-store";
import { SecureUser } from "@/schema/user";
import { CartItem } from "@/schema/cart-item";
import { CartItemComponent } from "@/components/cart/cart-item-component";
import { CartSummary } from "@/components/cart/cart-summary";

interface CartItemsProps {
  user: SecureUser;
  bucketUrl: string;
}

export const CartsItems = ({
  user,
  bucketUrl,
}: CartItemsProps) => {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const isLoading = useCartStore((state) => state.isLoading);

  const handleIncreaseQuantity = async (itemId: string) => {
    const item = items.find((item) => item.product.id === itemId);
    if (item) {
      const cartItem: CartItem = {
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          pictureUrls: item.product.pictureUrls,
          category: item.product.category
        },
        quantity: 1,
        subtotal: item.product.price
      }

      try {
        await addItem(user.id, cartItem);
      } catch (error) {
        console.error("Error al aumentar cantidad: ", error);
      }
    }
  }

  const handleDecreaseQuantity = async (productId: string) => {
    try {
      await removeItem(user.id, productId);
    } catch (error) {
      console.error("Error al disminuir cantidad o eliminar producto: ", error);
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart(user.id)
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:grid md:grid-cols-12 md:gap-6">

      <div className="md:col-span-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Tu carrito</h2>
        {items.length === 0 ? (
          <p className="text-gray-600">
            Tu carrito está vacío.{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Ver productos
            </a>
          </p>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <CartItemComponent
                key={item.product.id}
                item={item}
                isLoading={isLoading}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
                bucketUrl={bucketUrl}
              />
            ))}
          </div>
        )}
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className={`mt-6 px-4 py-2 rounded text-white ${
              isLoading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Vaciar carrito
          </button>
        )}
      </div>

      <CartSummary
        user={user}
        isLoading={isLoading}
      />

    </div>
  )
}
