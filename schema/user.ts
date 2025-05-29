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

export interface SecureUser {
  id: string;
  email: string;
  name: string;
  cart: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export const userToSecureUser = (user: User): SecureUser => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    cart: user.cart,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  }
}
