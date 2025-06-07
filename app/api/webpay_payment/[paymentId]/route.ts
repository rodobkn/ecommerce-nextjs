import { NextRequest, NextResponse } from "next/server";
import db from "@/clients/db";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";
import { getWebpayTransaction } from "@/utils/server/transbank/get-webpay-transaction";
import { clearCartFromDb } from "@/actions/user-cart/clear-cart-from-db"
import { Product } from "@/schema/product";
import { PaymentInterface, PaymentDetails } from "@/schema/payment";
import { Order, OrderStatus } from "@/schema/order";

enum FailureReason {
  UNAUTHENTICATED = "user_unauthenticated",
  PAYMENT_ID_IN_URL_MISSING = "payment_id_in_url_missing",
  PAYMENT_NOT_FOUND = "payment_not_found",
  MISSING_TOKEN_WS = "missing_token_ws",
  TRANSBANK_UNAUTHORIZED_TRANSACTION = "transbank_unauthorized_transaction",
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
      failureUrl.searchParams.set("reason", FailureReason.PAYMENT_ID_IN_URL_MISSING);
      return NextResponse.redirect(failureUrl.toString());
    }

    const secureUser = await getSecureUser();
    if (!secureUser) {
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
      failureUrl.searchParams.set("reason", FailureReason.UNAUTHENTICATED);
      return NextResponse.redirect(failureUrl.toString());
    }

    const paymentDoc = await db.collection("payments").doc(paymentId).get();
    if (!paymentDoc.exists) {
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
      failureUrl.searchParams.set("reason", FailureReason.PAYMENT_NOT_FOUND);
      return NextResponse.redirect(failureUrl.toString());
    }

    const payment = paymentDoc.data() as PaymentInterface;

    const { searchParams } = new URL(req.url);
    const token_ws = searchParams.get("token_ws");
    if (!token_ws) {
      const TBK_TOKEN = searchParams.get("TBK_TOKEN");
      console.log("TBK_TOKEN: ", TBK_TOKEN);
      const TBK_ID_SESION = searchParams.get("TBK_ID_SESION");
      console.log("TBK_ID_SESION: ", TBK_ID_SESION);
      const TBK_ORDEN_COMRA = searchParams.get("TBK_ORDEN_COMRA");
      console.log("TBK_ORDEN_COMRA: ", TBK_ORDEN_COMRA);
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
      failureUrl.searchParams.set("reason", FailureReason.MISSING_TOKEN_WS);
      return NextResponse.redirect(failureUrl.toString());
    }

    // Empezar la transacción con Webpay
    const tx = getWebpayTransaction();
    const paymentResponse = await tx.commit(token_ws);
    console.log("Webpay Response:", paymentResponse);

    // Actualizar detalles del pago en Firestore
    const updatedPaymentDetails: PaymentDetails = {
      ...payment.paymentDetails,
      isConfirmed: paymentResponse.response_code === 0 && paymentResponse.status === "AUTHORIZED",
      transbank: {
        buy_order: paymentResponse.buy_order,
        session_id: paymentResponse.session_id,
        status: paymentResponse.status,
        vci: paymentResponse.vci,
        authorization_code: paymentResponse.authorization_code,
        payment_type_code: paymentResponse.payment_type_code,
        response_code: paymentResponse.response_code,
        installments_number: paymentResponse.installments_number,
        token_ws,
      },
    };

    await paymentDoc.ref.update({
      paymentDetails: updatedPaymentDetails,
      updatedAt: new Date(),
    });

    if (!updatedPaymentDetails.isConfirmed) {
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/failure`);
      failureUrl.searchParams.set("reason", FailureReason.TRANSBANK_UNAUTHORIZED_TRANSACTION);
      return NextResponse.redirect(failureUrl.toString());
    }

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
    failureUrl.searchParams.set("reason", FailureReason.UNKNOWN_ERROR);
    return NextResponse.redirect(failureUrl.toString());
  }
}