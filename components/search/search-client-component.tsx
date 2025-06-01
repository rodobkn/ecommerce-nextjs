"use client";
import { useSearchStore } from "@/stores/search-store";
import { ProductCard } from "@/components/products/product-card";
import { Loader2 } from "lucide-react";

interface SearchClientComponentsProps {
  bucketUrl: string;
}

export const SearchClientComponent = ({
  bucketUrl
}: SearchClientComponentsProps) => {
  const { products, isLoading } = useSearchStore();

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
          <p className="text-center text-gray-600">Cargando productos...</p>
        </div>  
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-6 text-center">
            Resultados de Búsqueda
          </h1>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} bucketUrl={bucketUrl} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No se encontraron productos.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
