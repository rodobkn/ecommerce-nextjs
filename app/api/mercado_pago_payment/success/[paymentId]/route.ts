import { NextRequest, NextResponse } from "next/server";
import db from "@/clients/db";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";
import { clearCartFromDb } from "@/actions/user-cart/clear-cart-from-db";
import { Product } from "@/schema/product";
import { PaymentInterface, PaymentDetails } from "@/schema/payment";
import { Order, OrderStatus } from "@/schema/order";

enum MercadoPagoWeirdFailureReason {
  UNAUTHENTICATED = "user_unauthenticated",
  PAYMENT_ID_IN_URL_MISSING = "payment_id_in_url_missing",
  PAYMENT_NOT_FOUND = "payment_not_found",
  MISSING_MP_URL_PARAMS = "missing_mp_url_params",
  UNKNOWN_ERROR = "unknown_error",
}

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params;
    if (!paymentId) {
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
      failureUrl.searchParams.set("reason", MercadoPagoWeirdFailureReason.PAYMENT_ID_IN_URL_MISSING);
      return NextResponse.redirect(failureUrl.toString());
    }

    const secureUser = await getSecureUser();
    if (!secureUser) {
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
      failureUrl.searchParams.set("reason", MercadoPagoWeirdFailureReason.UNAUTHENTICATED);
      return NextResponse.redirect(failureUrl.toString());
    }

    const paymentDoc = await db.collection("payments").doc(paymentId).get();
    if (!paymentDoc.exists) {
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
      failureUrl.searchParams.set("reason", MercadoPagoWeirdFailureReason.PAYMENT_NOT_FOUND);
      return NextResponse.redirect(failureUrl.toString());
    }

    const payment = paymentDoc.data() as PaymentInterface;

    // Si el pago ya fue confirmado, evitar duplicaciones
    if (payment.paymentDetails.isConfirmed) {
      console.log(`Pago ${paymentId} ya estaba confirmado, evitando procesamiento duplicado.`);
      const fallbackSuccessUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/success`);
      return NextResponse.redirect(fallbackSuccessUrl.toString());
    }

    const { searchParams } = new URL(req.url);
    const mercadoPagoStatus = searchParams.get("status");
    const mercadoPagoPaymentId = searchParams.get("payment_id");

    if (!mercadoPagoStatus || !mercadoPagoPaymentId) {
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
      failureUrl.searchParams.set("reason", MercadoPagoWeirdFailureReason.MISSING_MP_URL_PARAMS);
      return NextResponse.redirect(failureUrl.toString());
    }

    // Actualizar detalles del pago en Firestore
    const updatedPaymentDetails: PaymentDetails = {
      ...payment.paymentDetails,
      isConfirmed: mercadoPagoStatus === "approved",
      mercadoPago: {
        status: mercadoPagoStatus,
        mp_payment_id: mercadoPagoPaymentId,
      },
    };

    await paymentDoc.ref.update({
      paymentDetails: updatedPaymentDetails,
      updatedAt: new Date(),
    });

    // Reducir el stock de los productos
    const productRefs = db.collection("products");
    for (const item of payment.purchasedCart) {
      const productDoc = await productRefs.doc(item.product.id).get();
      const product = productDoc.data() as Product;
      await productDoc.ref.update({
        stock: product.stock - item.quantity,
        updatedAt: new Date(),
      });
    }

    // Crear una orden en Firestore
    const orderRef = db.collection("orders").doc();
    const newOrder: Order = {
      id: orderRef.id,
      userId: payment.userId,
      userEmail: payment.userEmail,
      purchasedCart: payment.purchasedCart,
      paymentId: payment.id,
      shippingAddress: payment.shippingAddress,
      status: OrderStatus.RECEIVED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await orderRef.set(newOrder);

    // Limpiar el carrito del usuario
    await clearCartFromDb(payment.userId);

    // Redirigir al éxito
    const successUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/success`);
    return NextResponse.redirect(successUrl.toString());
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
    failureUrl.searchParams.set("reason", MercadoPagoWeirdFailureReason.UNKNOWN_ERROR);
    return NextResponse.redirect(failureUrl.toString());
  }
}
