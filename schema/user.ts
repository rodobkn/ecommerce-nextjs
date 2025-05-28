import { CartItem } from "@/schema/cart-item";

export enum RegistrationMethod {
  GOOGLE = "google",
  GITHUB = "github",
  INTERNAL = "internal",
}

export interface User {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  registrationMethod: RegistrationMethod;
  cart: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}
