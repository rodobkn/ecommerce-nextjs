"use client";

import { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Loader2 } from "lucide-react";
import { generateMercadoPagoPreference } from "@/actions/checkout/mercadopago/generate-mercadopago-preference";
import { CartItem } from "@/schema/cart-item";

interface MercadoPagoPaymentProps {
  cart: CartItem[];
  userAddress: string;
  mercadoPagoPublicKey: string;
}

export const MercadoPagoPayment = ({
  cart,
  userAddress,
  mercadoPagoPublicKey,
}: MercadoPagoPaymentProps) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAndCreatePreference = async () => {
      try {
        initMercadoPago(mercadoPagoPublicKey, { locale: 'es-CL' });

        const id = await generateMercadoPagoPreference({ cart, userAddress });
        if (id) {
          setPreferenceId(id); 
        }
      } catch (err) {
        console.error("Error generating Mercado Pago preference:", err);
        setError(
          "Ocurrió un error al generar el pago. Se acabó el stock de uno de tus productos o hay inconsistencias en tu carrito."
        );
      }
    };

    initializeAndCreatePreference();
  }, [cart, userAddress]);

  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  if (!preferenceId) {
    // Mostrar loader mientras se genera la preferencia
    return (
      <div className="flex items-center justify-center my-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const initialization = {
    preferenceId: preferenceId,
    redirectMode: "self" as "self",
  };

  const customization = {
    texts: {
      valueProp: "security_safety" as "security_safety",
      theme: "default",
    },
    customStyle: {
      hideValueProp: false,
    },
  };

  const onSubmit = async () => {
    console.log("Payment submitted:");
  };

  const onError = async (error: any) => {
    console.error("Error in Mercado Pago Brick:", error);
    setError("Error in Mercado Pago Brick")
  };

  const onReady = async () => {
    console.log("Mercado Pago Brick is ready");
  };

  return (
    <div className="my-6">
      <Wallet
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onError={onError}
        onReady={onReady}
      />
    </div>
  );
};
