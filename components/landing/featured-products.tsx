"use client";

import { ProductCard } from "@/components/products/product-card";
import { Product, ProductCategory } from "@/schema/product";

interface FeaturedProductsProps {
  products: Product[];
  bucketUrl: string;
}

export const FeaturedProducts = ({
  products,
  bucketUrl
}: FeaturedProductsProps) => {
  const books = products.filter((product) => product.category === ProductCategory.LITERATURE);
  const technology = products.filter((product) => product.category === ProductCategory.TECHNOLOGY);
  const plushies = products.filter((product) => product.category === ProductCategory.PLUSHIES);

  return (
    <div className="px-6 pt-6 pb-10 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Explora Nuestros Productos</h2>

      {/* Seccion de libros */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Literatura</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((product) => (
            <ProductCard key={product.id} product={product} bucketUrl={bucketUrl} />
          ))}
        </div>
      </section>

      {/* Seccion de tecnologia */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Tecnología</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {technology.map((product) => (
            <ProductCard key={product.id} product={product} bucketUrl={bucketUrl} />
          ))}
        </div>
      </section>

      {/* Seccion de peluches */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Peluches</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plushies.map((product) => (
            <ProductCard key={product.id} product={product} bucketUrl={bucketUrl} />
          ))}
        </div>
      </section>

    </div>
  )
}
