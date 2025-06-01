"use client";

import { Product } from "@/schema/product";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  bucketUrl: string;
}

export const ProductCard = ({
  product,
  bucketUrl
}: ProductCardProps) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/products/${product.id}`);
  }

  const formattedPrice = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(product.price);

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
      onClick={handleRedirect}
    >
      {/* Imagen del Producto */}
      <img
        src={`${bucketUrl}/${product.pictureUrls[0]}`}
        alt={product.name}
        className="w-full h-auto object-cover"
      />

      {/* Información del Producto */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">{formattedPrice}</span>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
