import { NextRequest, NextResponse } from "next/server";
import db from "@/clients/db";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";
import { PaymentInterface, PaymentDetails } from "@/schema/payment";

enum MercadoPagoFailureReason {
  UNAUTHENTICATED = "user_unauthenticated",
  PAYMENT_ID_IN_URL_MISSING = "payment_id_in_url_missing",
  PAYMENT_NOT_FOUND = "payment_not_found",
  MISSING_MP_URL_PARAMS = "missing_mp_url_params",
  MERCADO_PAGO_UNAUTHORIZED_TRANSACTION = "mercado_pago_unauthorized_transaction",
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
      failureUrl.searchParams.set("reason", MercadoPagoFailureReason.PAYMENT_ID_IN_URL_MISSING);
      return NextResponse.redirect(failureUrl.toString());
    }

    const secureUser = await getSecureUser();
    if (!secureUser) {
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
      failureUrl.searchParams.set("reason", MercadoPagoFailureReason.UNAUTHENTICATED);
      return NextResponse.redirect(failureUrl.toString());
    }

    const paymentDoc = await db.collection("payments").doc(paymentId).get();
    if (!paymentDoc.exists) {
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
      failureUrl.searchParams.set("reason", MercadoPagoFailureReason.PAYMENT_NOT_FOUND);
      return NextResponse.redirect(failureUrl.toString());
    }

    const payment = paymentDoc.data() as PaymentInterface;

    const { searchParams } = new URL(req.url);
    const mercadoPagoStatus = searchParams.get("status");
    const mercadoPagoPaymentId = searchParams.get("payment_id");

    if (!mercadoPagoStatus || !mercadoPagoPaymentId) {
      const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
      failureUrl.searchParams.set("reason", MercadoPagoFailureReason.MISSING_MP_URL_PARAMS);
      return NextResponse.redirect(failureUrl.toString());
    }

    // Actualizar detalles del pago en Firestore
    const updatedPaymentDetails: PaymentDetails = {
      ...payment.paymentDetails,
      isConfirmed: false,
      mercadoPago: {
        status: mercadoPagoStatus,
        mp_payment_id: mercadoPagoPaymentId,
      },
    };

    await paymentDoc.ref.update({
      paymentDetails: updatedPaymentDetails,
      updatedAt: new Date(),
    });

    const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/failure`);
    failureUrl.searchParams.set("reason", MercadoPagoFailureReason.MERCADO_PAGO_UNAUTHORIZED_TRANSACTION);
    return NextResponse.redirect(failureUrl.toString());
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    const failureUrl = new URL(`${process.env.ORIGIN_URL}/payment-status/weird-failure`);
    failureUrl.searchParams.set("reason", MercadoPagoFailureReason.UNKNOWN_ERROR);
    return NextResponse.redirect(failureUrl.toString());
  }
}