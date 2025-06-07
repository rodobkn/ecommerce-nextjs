import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";

interface PaymentFailurePageProps {
  searchParams: {
    reason?: string;
  };
}

const PaymentFailurePage = async ({
  searchParams
}: PaymentFailurePageProps) => {
  const secureUser = await getSecureUser();

  // Mensaje de error del backend
  const failureMessage: string = searchParams.reason || "El pago no fue autorizado.";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar user={secureUser} />

      {/* Mensaje principal */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">¡Pago No Autorizado!</h1>
        <p className="text-lg text-gray-700 mb-4">
          Lamentablemente, no se pudo completar tu pago. Esto puede deberse a que Transbank o Mercado Pago rechazó la transacción o hubo un error con tu tarjeta.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Mensaje del sistema: <span className="font-semibold">{failureMessage}</span>
        </p>
        <p className="text-md text-gray-600 mb-6">
          Por favor, revisa el estado de tus pagos.
        </p>
        <p className="text-md text-gray-700 mb-6 text-center">
          Si crees que hubo un error, saca un pantallazo de esta página y mándalo al número de soporte. Estamos aquí para ayudarte.
        </p>
        <a
          href="/payments"
          className="w-48 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
        >
          Ver Mis Pagos
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentFailurePage;
