import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";

const PaymentSuccessPage = async () => {
  const secureUser = await getSecureUser();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar user={secureUser} />

      {/* Mensaje principal */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">¡Pago exitoso!</h1>
        <p className="text-lg text-gray-700 mb-6">Gracias por tu compra. Tu pedido ha sido procesado exitosamente.</p>
        <a
          href="/orders"
          className="w-48 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
        >
          Ver Mis Órdenes
        </a>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
