import { redirect } from 'next/navigation';
import { getSecureUser } from "@/utils/server/auth/get-secure-user";
import { CheckoutNavbar } from '@/components/checkout/checkout-navbar';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';

const CheckoutPage = async () => {
  const secureUser = await getSecureUser();

  if (!secureUser || secureUser.cart.length === 0) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <CheckoutNavbar />
      <div className="flex-grow max-w-7xl mx-auto px-6 py-10 md:grid md:grid-cols-12 md:gap-6">
        <div className="md:col-span-8 md:self-start bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Detalles de la Compra</h2>
          {secureUser.cart.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4 mb-4 border-b pb-4 last:border-b-0 last:mb-0">
              <img
                src={`${process.env.BUCKET_URL}/${item.product.pictureUrls[0]}`}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                <p className="font-bold text-blue-600 mt-1">
                  Precio unitario:{" "}
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.product.price)}
                </p>
                <p className="font-bold text-gray-700">
                  Subtotal:{" "}
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.subtotal)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <CheckoutSummary
          user={secureUser}
          mercadoPagoPublicKey="Placeholder_mercadoPago_key"
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
