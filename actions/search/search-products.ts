"use server";

import db from "@/clients/db";
import { Product } from "@/schema/product";

export const searchProducts = async (
  searchQuery: string,
  category: string
) => {
  const trimmedQuery = searchQuery.trim();

  // caso borde cuando es un string vacio ""
  if (!trimmedQuery) {
    return [];
  }

  const snapshot = await db.collection("products").get();

  const allProducts: Product[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      price: data.price,
      pictureUrls: data.pictureUrls,
      stock: data.stock,
      category: data.category,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Product;
  });
 
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesQuery =
      product.name.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(trimmedQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  })

  return filteredProducts;
}
