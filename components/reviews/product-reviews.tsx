"use client";

import { useState } from "react";
import { Review } from "@/schema/review";
import { SecureUser } from "@/schema/user";
import { addReview } from "@/actions/reviews/add-review";
import { User } from "lucide-react";

interface ReviewsProps {
  initialReviews: Review[];
  productId: string;
  user: SecureUser | null;
}

export const ProductReviews = ({
  initialReviews,
  productId,
  user,
}: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddReview = async () => {
    if (!user) return;

    if (rating < 0 || rating > 5 || !comment.trim()) {
      setError("La calificación debe ser entre 0 y 5, y el comentario no puede estar vacío.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const userName = user.name || user.email.split("@")[0];

      const newReview = await addReview({
        productId,
        userId: user.id,
        userName,
        rating,
        comment,
      });

      // Agregar la nueva reseña al principio del array de reseñas
      setReviews((prevReviews) => [newReview, ...prevReviews]);

      // Resetear los valores del formulario
      setRating(0);
      setComment("");
      setIsFormVisible(false);
    } catch (err) {
      console.error("Error al agregar reseña:", err);
      const errorMessage = "Ocurrió un error al agregar tu reseña. Puede ser que ya hayas agregado una reseña o no hayas comprado el producto.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">Aún no hay reseñas para este producto.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="w-full md:w-2/3 bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-800">{review.userName}</h3>
                </div>
                <span className="text-yellow-500 text-sm">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span key={index}>
                      {index < review.rating ? "★" : "☆"}
                    </span>
                  ))}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-gray-500 text-sm mt-2">
                Publicado el {review.createdAt.toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Agregar una reseña</h3>

        {!user ? (
          <div className="text-sm text-gray-700">
            Debes{" "}
            <a
              href="/auth/register"
              className="text-blue-600 hover:underline"
            >
              registrarte
            </a>{" "}
            o{" "}
            <a
              href="/auth/login"
              className="text-blue-600 hover:underline"
            >
              iniciar sesión
            </a>{" "}
            para agregar una reseña.
          </div>
        ) : (
          <>
            {!isFormVisible ? (
              <button
                onClick={() => setIsFormVisible(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Escribir una reseña
              </button>
            ) : (
              <>
                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                <div className="flex items-center mb-4">
                  <label htmlFor="rating" className="mr-2 text-gray-700">
                    Calificación:
                  </label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border border-gray-300 rounded-md p-2"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe tu reseña aquí..."
                  rows={4}
                  className="w-full md:w-2/3 border border-gray-300 rounded-md p-2 mb-4"
                />
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleAddReview}
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-white rounded-md ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Reseña"}
                  </button>
                  <button
                    onClick={() => setIsFormVisible(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
