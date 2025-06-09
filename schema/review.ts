export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // Entero entre el 0 al 5 (inclusive los dos)
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}