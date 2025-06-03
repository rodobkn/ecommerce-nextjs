"use client";

import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "@/stores/cart-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SecureUser } from "@/schema/user";

interface CartIconProps {
  user: SecureUser;
}

export const CartIcon = ({
  user
}: CartIconProps) => {
  const totalItems = useCartStore((state) => state.totalItems);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const router = useRouter();

  useEffect(() => {
    fetchCart(user.id).catch((error) =>
      console.error("Error fetching cart on mount:", error)
    );
  }, [user.id])

  const handleGoToCart = () => {
    router.push("/cart");
  };

  return (
    <div
      className="relative cursor-pointer"
      onClick={handleGoToCart}
    >
      <FaShoppingCart className="text-2xl text-white hover:text-gray-300" />

      {/* Circulo rojo con la cantidad de productos */}
      {totalItems > 0 && (
        <span className="absolute -top-3 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </div>
  )
}
