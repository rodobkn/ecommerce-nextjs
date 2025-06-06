"use server";

import { getWebpayTransaction } from "@/utils/server/transbank/get-webpay-transaction";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";
import { validateCartStock } from "@/utils/server/cart/validate-cart-stock";
import { validateCartIntegrity } from "@/utils/server/cart/validate-cart-integrity";
import { CartItem } from "@/schema/cart-item";
import { PaymentInterface } from "@/schema/payment";
import db from "@/clients/db";

export const generateWebpayPayment = async ({
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

  // Máximo 26 caracteres
  const buyOrder = newPaymentId;

  // Máximo 61 caracteres
  const sessionId = secureUser.id;

  // Definir la returnUrl
  const currentOrigin: string = process.env.ORIGIN_URL!;
  // Máximo 256 caracteres
  const returnUrl = `${currentOrigin}/api/webpay_payment/${newPaymentId}`;

  // Crear la transacción con WebPay
  const tx = getWebpayTransaction();
  const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

  // Retornar token y URL
  return { token: response.token, url: response.url };
};
