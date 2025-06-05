import { CartItem } from "@/schema/cart-item";

export enum OrderStatus {
	RECEIVED = 1,
	PROCESSING = 2,
	DISPATCHED = 3,
	DELIVERED = 4, 
	FAILED = 5
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  purchasedCart: CartItem[];
  paymentId: string;
  shippingAddress: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
