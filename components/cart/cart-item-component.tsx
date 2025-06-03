"use client";

import { CartItem } from "@/schema/cart-item";

interface CartItemComponentProps {
  item: CartItem;
  isLoading: boolean;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  bucketUrl: string;
}

export const CartItemComponent = ({
  item,
  isLoading,
  onIncrease,
  onDecrease,
  bucketUrl,
}: CartItemComponentProps) => {
  return (
    <div className="flex items-center gap-4 border-b pb-4">
      <img
        src={`${bucketUrl}/${item.product.pictureUrls[0]}`}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{item.product.name}</h3>
        <p className="text-gray-600">
          {new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(item.product.price)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onDecrease(item.product.id)}
            className={`px-2 py-1 rounded ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            disabled={isLoading}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => onIncrease(item.product.id)}
            className={`px-2 py-1 rounded ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            disabled={isLoading}
          >
            +
          </button>
        </div>
      </div>
      <p className="text-lg font-bold">
        {new Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
        }).format(item.subtotal)}
      </p>
    </div>
  )
}
