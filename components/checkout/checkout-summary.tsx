"use client";

import { SecureUser } from "@/schema/user";
import { useState } from "react";
import { PaymentProviderSelector } from "@/components/checkout/payment-provider-selector";

interface CheckoutSummaryProps {
  user: SecureUser;
  mercadoPagoPublicKey: string;
}

export const CheckoutSummary = ({
  user,
  mercadoPagoPublicKey,
}: CheckoutSummaryProps) => {
  const [address, setAddress] = useState<string>("");
  const [isAddressConfirmed, setIsAddressConfirmed] = useState<boolean>(false);

  const handleAddressConfirmation = () => {
    if (!address.trim()) {
      alert("Por favor, ingresa una dirección válida.");
      return;
    }
    setIsAddressConfirmed(true);
  };

  return (
    <div className="md:col-span-4 md:self-start bg-gray-50 shadow rounded-lg p-6 mt-4 md:mt-0">
      <h3 className="text-xl font-bold mb-4">Resumen</h3>
      <p className="flex justify-between">
        <span>Total:</span>
        <span className="font-bold text-lg">
          {new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(
            user.cart.reduce((total, item) => total + item.subtotal, 0)
          )}
        </span>
      </p>

      {/* Dirección del usuario */}
      {!isAddressConfirmed ? (
        <div className="mt-4 space-y-4">
          <p className="font-semibold">Dirección de envío</p>
          <input
            type="text"
            placeholder="Ingresa tu dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded mb-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
          <button
            onClick={handleAddressConfirmation}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Confirmar Dirección
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p className="font-semibold mb-2">Dirección confirmada:</p>
          <p
            className="p-2 border rounded bg-gray-100 break-words whitespace-normal max-w-[300px] md:max-w-none"
          >
            {address}
          </p>
          <button
            onClick={() => setIsAddressConfirmed(false)}
            className="text-blue-600 underline text-sm mt-2"
          >
            Editar dirección
          </button>
        </div>
      )}

      {/* Métodos de pago */}
      {isAddressConfirmed && (
        <PaymentProviderSelector
          user={user}
          userAddress={address}
          mercadoPagoPublicKey={mercadoPagoPublicKey}
        />
      )}
    </div>
  );
};
