"use client";

import { useState } from "react";
import { SecureUser } from "@/schema/user";
import { WebpayPayment } from "@/components/checkout/webpay-payment";
import { MercadoPagoPayment } from "@/components/checkout/mercado-pago-payment";

interface PaymentProviderSelectorProps {
  user: SecureUser;
  userAddress: string;
  mercadoPagoPublicKey: string;
}

export const PaymentProviderSelector = ({
  user,
  userAddress,
  mercadoPagoPublicKey,
}: PaymentProviderSelectorProps) => {
  const [selectedProvider, setSelectedProvider] = useState("webpay");

  const handleSelection = (provider: string) => {
    setSelectedProvider(provider);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Métodos de pago</h3>
      {/* Selector de Proveedor */}
      <div className="flex flex-col gap-4">
        {/* WebPay */}
        <label className="flex items-center space-x-4 cursor-pointer">
          <input
            type="radio"
            name="paymentProvider"
            value="webpay"
            checked={selectedProvider === "webpay"}
            onChange={() => handleSelection("webpay")}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1 flex justify-center">
            <img
              src="/webpay.png"
              alt="WebPay Logo"
              className="w-3/4 object-contain"
            />
          </div>
        </label>

        {/* Mercado Pago */}
        <label className="flex items-center space-x-4 cursor-pointer">
          <input
            type="radio"
            name="paymentProvider"
            value="mercadopago"
            checked={selectedProvider === "mercadopago"}
            onChange={() => handleSelection("mercadopago")}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1 flex justify-center">
            <img
              src="/mercadopago.png"
              alt="Mercado Pago Logo"
              className="w-5/6 object-contain"
            />
          </div>
        </label>
      </div>

      {/* Componente de Pago */}
      <div className="mt-6">
        {selectedProvider === "webpay" ? (
          <WebpayPayment
            cart={user.cart}
            userAddress={userAddress}
          />
        ) : (
          <MercadoPagoPayment
            cart={user.cart}
            userAddress={userAddress}
            mercadoPagoPublicKey={mercadoPagoPublicKey}
          />
        )}
      </div>
    </div>
  );
};
