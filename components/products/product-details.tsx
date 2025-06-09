"use client";

import { Product } from "@/schema/product";
import { CartItem } from "@/schema/cart-item";
import { SecureUser } from "@/schema/user";
import { Review } from "@/schema/review";
import { redirectToRegister } from "@/actions/redirects/redirect-to-register";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation"
import { ProductReviews } from "@/components/reviews/product-reviews";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Importa estilos css de Swiper
import "swiper/css/pagination"; // importa estilos css de pagination de swiper
import { Pagination } from "swiper/modules";

interface ProductDetailsProps {
  product: Product;
  user: SecureUser | null;
  reviews: Review[];
  bucketUrl: string;
}

export const ProductDetails = ({
  product,
  user,
  reviews,
  bucketUrl,
}: ProductDetailsProps) => {
  const [currentImage, setCurrentImage] = useState(product.pictureUrls[0]);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const possibleCartItem = items.find((item) => item.product.id === product.id);
  const productQuantityInCart = possibleCartItem ? possibleCartItem.quantity : 0;

  // Calcular el promedio de estrellitas de las reviews
  const averageRating =
    reviews.length > 0
      ? Math.ceil(
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        )
      : null;

  const handleAddToCart = async () => {
    if (!user) {
      redirectToRegister();
      return;
    }

    // Validar si el stock es suficiente antes de agregar
    if (productQuantityInCart + 1 > product.stock) {
      alert("No puedes agregar más de la cantidad disponible en stock");
      return;
    }

    const cartItem: CartItem = {
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        pictureUrls: product.pictureUrls,
        category: product.category
      },
      quantity: 1,
      subtotal: product.price,
    };

    try {
      await addItem(user.id, cartItem);
    } catch (error) {
      console.error("Error al agregar al carrito: ", error);
    }
  };

  const handleGoToCart = () => {
    router.push("/cart");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 md:py-10">
      {/* Diseño para pantallas pequeñas */}
      <div className="md:hidden">
        <h1
          className={`text-2xl font-bold ${
            averageRating === null ? "mb-4" : "mb-1"
          }`}
        >
          {product.name}
        </h1>
        {averageRating !== null && (
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex text-yellow-500 text-lg">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  {index < averageRating ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-gray-600 text-sm">({reviews.length})</span>
          </div>
        )}
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          onSlideChange={(swiper) =>
            setCurrentImage(product.pictureUrls[swiper.activeIndex])
          }
          className="w-full rounded-lg shadow-lg"
        >
          {product.pictureUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <img
                src={`${bucketUrl}/${url}`}
                alt={product.name}
                className="w-full h-auto object-contain rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <p className="text-lg text-gray-700 mt-4">{product.description}</p>
        <div className="mt-6 bg-white p-4 shadow-lg rounded-lg flex flex-col items-center text-center">
          <h1 className="text-lg font-semibold text-gray-800">Precio</h1>
          <p className="text-2xl font-bold text-gray-900 flex items-center">
            {new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP"
            }).format(product.price)}
            <span className="ml-1 text-gray-700 text-lg">CLP</span>
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <h2 className="text-lg font-semibold text-gray-800">Stock:</h2>
            <p
              className={`text-lg font-bold ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} disponibles`
                : "Sin stock"
              }
            </p>
          </div>
          <button
            className={`w-full px-4 py-2 mt-4 font-medium rounded-lg transition ${
              product.stock > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
          </button>
          {productQuantityInCart > 0 && (
            <p className="text-sm text-green-600 mt-2">
              Ya tienes {productQuantityInCart} de este producto en tu carrito.
            </p>
          )}
          {productQuantityInCart > 0 && (
            <button
              onClick={handleGoToCart}
              className="w-full px-4 py-2 mt-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Ir al carrito
            </button>
          )}
        </div>
      </div>

      {/* Diseño para pantallas grandes */}
      <div className="hidden md:grid md:grid-cols-12 gap-8">
        {/* Galería de imágenes */}
        <div className="col-span-2 flex flex-col items-center gap-4">
          {product.pictureUrls.map((url, index) => (
            <img
              key={index}
              src={`${bucketUrl}/${url}`}
              alt={`Producto - ${product.name}`}
              className={`w-24 h-24 object-contain cursor-pointer rounded ${
                currentImage === url ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => setCurrentImage(url)}
            />
          ))}
        </div>

        {/* Imagen actual */}
        <div className="col-span-6">
          <img
            src={`${bucketUrl}/${currentImage}`}
            alt={product.name}
            className="w-full h-auto object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Detalles del producto y compra */}
        <div className="col-span-4 bg-white shadow-lg p-6 rounded-lg self-start">
          <h1
            className={`text-2xl font-bold ${
              averageRating === null ? "mb-4" : "mb-1"
            }`}
          >
            {product.name}
          </h1>

          {/* Mostrar promedio de estrellas y número de reseñas */}
          {averageRating !== null && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex text-yellow-500 text-lg">
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index}>
                    {index < averageRating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-gray-600 text-sm">({reviews.length})</span>
            </div>
          )}

          <p className="text-xl font-semibold mb-4 flex items-center">
            {new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP"
            }).format(product.price)}
            <span className="ml-1">CLP</span>
          </p>
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-md font-medium text-gray-800">Stock:</h3>
            <p
              className={`text-md font-semibold ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} disponibles`
                : "Sin stock"}
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-6">{product.description}</p>
          <ul className="mb-6 space-y-2">
            <li className="flex items-center space-x-2">
              <span className="text-green-600">&#10003;</span>
              <p className="text-sm text-gray-700">Envío rápido y confiable</p>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-600">&#10003;</span>
              <p className="text-sm text-gray-700">Pagos 100% seguros y protegidos</p>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-600">&#10003;</span>
              <p className="text-sm text-gray-700">Garantía de calidad</p>
            </li>
          </ul>
          <button
            className={`w-full px-4 py-2 text-lg font-medium rounded-lg transition ${
              product.stock > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
          </button>
          {productQuantityInCart > 0 && (
            <p className="text-sm text-green-600 mt-2">
              Ya tienes {productQuantityInCart} de este producto en tu carrito.
            </p>
          )}
          {productQuantityInCart > 0 && (
            <button
              onClick={handleGoToCart}
              className="w-full px-4 py-2 mt-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-center"
            >
              Ir al carrito
            </button>
          )}
        </div>
      </div>

      {/* Descripcion extendida solo para pantallas grandes */}
      <div className="hidden md:block mt-10">
        <h2 className="text-xl font-bold mb-4">Descripción del Producto</h2>
        <p className="text-gray-700">{product.description}</p>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Reseñas</h2>
        <ProductReviews
          initialReviews={reviews}
          productId={product.id}
          user={user}
        />
      </div>

    </div>
  )
}
