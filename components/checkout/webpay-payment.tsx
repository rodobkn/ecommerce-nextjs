"use client";

import { useState, useEffect } from "react";
import { generateWebpayPayment } from "@/actions/checkout/transbank/generate-webpay-payment";
import { Loader2 } from "lucide-react";
import { CartItem } from "@/schema/cart-item";

interface WebpayPaymentProps {
  cart: CartItem[];
  userAddress: string;
}

export const WebpayPayment = ({
  cart,
  userAddress
}: WebpayPaymentProps) => {
  const [paymentData, setPaymentData] = useState<{
    token: string;
    url: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Generar el pago con WebPay
    generateWebpayPayment({ cart, userAddress })
      .then((data) => {
        setPaymentData({
          token: data.token,
          url: data.url,
        });
      })
      .catch((error) => {
        console.error("Error generating WebPay payment:", error);
        setError("Ocurrió un error al generar el pago. Se acabó el stock de uno de tus productos o hay inconsistencias en tu carrito.");
      });
  }, [cart, userAddress]);

  if (error) {
    return (
      <div className="text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (paymentData === null) {
    return (
      <div className="flex items-center justify-center my-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <form action={paymentData.url} method="POST" className="my-6">
      <input type="hidden" name="token_ws" value={paymentData.token} />
      <input
        type="submit"
        value="Pagar con Webpay"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 font-semibold cursor-pointer"
      />
    </form>
  );
};