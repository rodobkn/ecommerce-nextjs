"use server";

import { Review } from "@/schema/review";
import { Order } from "@/schema/order";
import db from "@/clients/db";

export const addReview = async ({
  productId,
  userId,
  userName,
  rating,
  comment,
}: {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}) => {
  // Validar que el comentario no esté vacío
  if (!comment.trim()) {
    throw new Error("El comentario no puede estar vacío.");
  }

  // Validar que el rating sea un número entero entre 0 y 5
  if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
    throw new Error("La calificación debe ser un número entero entre 0 y 5.");
  }

  // Validar que el productId exista en la base de datos
  const productSnapshot = await db.collection("products").doc(productId).get();
  if (!productSnapshot.exists) {
    throw new Error("El producto especificado no existe.");
  }

  // Validar que el userId exista en la base de datos
  const userSnapshot = await db.collection("users").doc(userId).get();
  if (!userSnapshot.exists) {
    throw new Error("El usuario no existe.");
  }

  // Verificar si ya existe una reseña del usuario para este producto
  const reviewsSnapshot = await db
    .collection("reviews")
    .where("productId", "==", productId)
    .get();

  const hasExistingReview = reviewsSnapshot.docs.some((doc) => {
    const review = doc.data() as Review;
    return review.userId === userId;
  });

  if (hasExistingReview) {
    throw new Error("El usuario ya ha realizado una reseña para este producto.");
  }

  // Validar que el usuario haya comprado el producto
  const ordersSnapshot = await db
    .collection("orders")
    .where("userId", "==", userId)
    .get();

  if (ordersSnapshot.empty) {
    throw new Error("El usuario no tiene pedidos.");
  }

  const userHasPurchasedProduct = ordersSnapshot.docs.some((doc) => {
    const order = doc.data() as Order;
    return order.purchasedCart.some((item) => item.product.id === productId);
  });

  if (!userHasPurchasedProduct) {
    throw new Error("El usuario no ha comprado este producto.");
  }

  // Agregar la resena
  const reviewRef = db.collection("reviews").doc();

  const newReview: Review = {
    id: reviewRef.id,
    productId,
    userId,
    userName,
    rating,
    comment,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await reviewRef.set(newReview);

  return newReview;
};
