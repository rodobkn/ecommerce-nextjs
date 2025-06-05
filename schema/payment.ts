import { CartItem } from "@/schema/cart-item";

interface MercadoPagoPaymentDetails {
  mp_payment_id: string; // Mercado Pago Payment ID
  status: string; // Mercado Pago payment Status
}

interface TransbankPaymentDetails {
  buy_order: string; // (transbank transaction id) Store purchase order. This number must be unique for each transaction.
  session_id: string; // session identifier, in this case user id
  status: string; // Transaction status
  vci: string; // Cardholder authentication result
  authorization_code: string; // Transaction authorization code
  payment_type_code: string; // Payment type of the transaction: VD = Debit Sale, VC = Sale in installments, VP = Prepaid Sale, etc ...
  response_code: number; // Authorization response code -> 0 = Transaction approved
  installments_number: number; // numero de cuotas/fees
  token_ws: string; // token of the transaction
}

export interface PaymentDetails {
  transbank?: TransbankPaymentDetails;
  mercadoPago?: MercadoPagoPaymentDetails;
  isConfirmed: boolean;
}

export interface PaymentInterface {
  id: string;
  userId: string;
  userEmail: string;
  shippingAddress: string;
  purchasedCart: CartItem[];
  totalAmount: number;
  paymentDetails: PaymentDetails;
  createdAt: Date;
  updatedAt: Date;
}
