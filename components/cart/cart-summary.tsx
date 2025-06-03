"use client";

import { SecureUser } from "@/schema/user";
import { useCartStore } from "@/stores/cart-store";
import { validateUserCart } from "@/actions/user-cart/validate-user-cart";
import { useEffect, useState } from "react";

interface CartSummaryProps {
  user: SecureUser;
  isLoading: boolean;
}

export const CartSummary = ({
  user,
  isLoading
}: CartSummaryProps) => {
  const items = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const totalItems = useCartStore((state) => state.totalItems);

  const [validationErrors, setValidationErros] = useState<string[]>([]);
  const [isCartValid, setIsCartValid] = useState(true);

  // Validar el carrito cada vez que cambien los items
  useEffect(() => {
    const validate = async () => {
      try {
        const { isValid, errors } = await validateUserCart(user.id, items);
        setIsCartValid(isValid);
        setValidationErros(errors);
      } catch (error) {
        console.error("Error al validar el carrito:", error);
      }
    }

    validate();
  }, [items, user.id]);

  return (
    <div className="md:col-span-4 md:self-start bg-gray-50 shadow rounded-lg p-6 mt-4 md:mt-0">
      <h3 className="text-xl font-bold">Resumen de compra</h3>
      <p className="flex justify-between mt-2">
        <span>Total productos:</span> <span>{totalItems}</span>
      </p>
      <p className="flex justify-between mt-2">
        <span>Total:</span>{" "}
        <span className="font-bold text-lg">
          {new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(totalAmount)}
        </span>
      </p>
      {isLoading ? (
        <div
          className="mt-4 w-full text-center px-4 py-2 bg-blue-400 text-white rounded cursor-not-allowed"
        >
          Procesando...
        </div>
      ): isCartValid && items.length > 0 ? (
        <a
          href="/checkout"
          className="mt-4 block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Continuar con la compra
        </a>
      ): items.length === 0 ? (
        <div
          className="mt-4 w-full text-center px-4 py-2 bg-gray-100 text-gray-600 rounded"
        >
          Agregar productos al carrito para continuar con la compra
        </div>
      ): (
        <div
          className="mt-4 bg-red-100 text-red-600 text-center p-4 rounded"
        >
          <p className="font-bold">Errores en el carrito:</p>
          <ul className="mt-2 space-y-1 text-sm">
            {validationErrors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ) 
}
