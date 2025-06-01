"use client";

import { Product } from "@/schema/product";
import { SecureUser } from "@/schema/user";
import { redirectToRegister } from "@/actions/redirects/redirect-to-register";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Importa estilos css de Swiper
import "swiper/css/pagination"; // importa estilos css de pagination de swiper
import { Pagination } from "swiper/modules";

interface ProductDetailsProps {
  product: Product;
  user: SecureUser | null;
  bucketUrl: string;
}

export const ProductDetails = ({
  product,
  user,
  bucketUrl,
}: ProductDetailsProps) => {
  const [currentImage, setCurrentImage] = useState(product.pictureUrls[0]);

  const handleAddToCart = () => {
    if (!user) {
      redirectToRegister();
      return;
    }
    console.log("Agregando el siguiente producto al carrito: ", product.name)
  }

  const handleGoToCart = () => {
    console.log("Redirigiendo al carrito");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 md:py-10">
      {/* Diseño para pantallas pequeñas */}
      <div className="md:hidden">
        <h1
          className={`text-2xl font-bold`}
        >
          {product.name}
        </h1>
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
            className={`text-2xl font-bold`}
          >
            {product.name}
          </h1>
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
        </div>
      </div>

      {/* Descripcion extendida solo para pantallas grandes */}
      <div className="hidden md:block mt-10">
        <h2 className="text-xl font-bold mb-4">Descripción del Producto</h2>
        <p className="text-gray-700">{product.description}</p>
      </div>

    </div>
  )
}
