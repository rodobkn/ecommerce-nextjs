"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";
import { validateCartStock } from "@/utils/server/cart/validate-cart-stock";
import { validateCartIntegrity } from "@/utils/server/cart/validate-cart-integrity";
import { CartItem } from "@/schema/cart-item";
import { PaymentInterface } from "@/schema/payment";
import db from "@/clients/db";

export const generateMercadoPagoPreference = async ({
  cart,
  userAddress
}: {
  cart: CartItem[];
  userAddress: string;
}) => {
  // Obtener usuario autenticado
  const secureUser = await getSecureUser();

  if (!secureUser) {
    throw new Error("User not authenticated");
  }

  // Validar que el carrito no esté vacío
  if (!cart || cart.length === 0) {
    throw new Error("Cart is empty");
  }

  // Validar stock del carrito
  const isStockValid = await validateCartStock(cart);
  if (!isStockValid) {
    throw new Error("Cart contains items with insufficient stock.");
  }

  // Validar que el carrito recibido del cliente sea el mismo que el usuario tiene en la DB
  const isCartValid = validateCartIntegrity(cart, secureUser.cart);
  if (!isCartValid) {
    throw new Error("Cart mismatch with database. Please refresh and try again.");
  }

  // Calcular el monto total del carrito
  const amount = cart.reduce((total, item) => total + item.subtotal, 0);

  const paymentRef = db.collection("payments").doc();
  const newPaymentId = paymentRef.id;

  const newPayment: PaymentInterface = {
    id: newPaymentId,
    userId: secureUser.id,
    userEmail: secureUser.email,
    shippingAddress: userAddress,
    purchasedCart: cart,
    totalAmount: amount,
    paymentDetails: {
      isConfirmed: false, // Inicialmente no confirmado
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Guardar el nuevo pago en Firestore
  await paymentRef.set(newPayment);

  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!
  });
  const mercadoPagoPreference = new Preference(client);

  const items = cart.map((item) => ({
    id: item.product.id,
    title: item.product.name,
    quantity: item.quantity,
    unit_price: item.product.price,
    currency_id: "CLP",
  }));

  // Definir el origin
  const currentOrigin: string = process.env.ORIGIN_URL!;

  const preferencePayload = {
    body: {
      items,
      // purpose: "wallet_purchase", // Limitar solo a usuarios registrados (en local hay que comentarlo para que funcione el sandbox de mercado pago)
      external_reference: newPaymentId, // Asociar preferencia con el ID del pago
      payer: {
        email: secureUser.email,
      },
      back_urls: {
        success: `${currentOrigin}/api/mercado_pago_payment/success/${newPaymentId}`,
        failure: `${currentOrigin}/api/mercado_pago_payment/failure/${newPaymentId}`,
        // pending: `${currentOrigin}/payment-pending`,
      },
      auto_return: "approved", // Redirigir automáticamente si se aprueba. En local luego de un tiempo resulta que hay que comentarlo... hay que mencionar que son imcompententes lo de mercado pago y siempre pueden haber errores raros
      binary_mode: true, // solo puede ser aprobado o rechazado
    }
  };

  const response = await mercadoPagoPreference.create(preferencePayload)

  // Retornar el ID de la preferencia generada
  return response.id;
};
