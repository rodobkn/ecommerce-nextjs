import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";

interface WeirdFailurePaymentPageProps {
  searchParams: {
    reason?: string;
  };
}

const WeirdFailurePaymentPage = async ({
  searchParams
}: WeirdFailurePaymentPageProps) => {
  const secureUser = await getSecureUser();

  // Mensaje de error del backend
  const failureMessage: string = searchParams.reason || "Hubo un error desconocido.";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar user={secureUser} />

      {/* Mensaje principal */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">¡Pago Fallido!</h1>
        <p className="text-lg text-gray-700 mb-4">
          Lamentablemente, no se pudo procesar tu pago. Esto es un fallo inesperado que no debería suceder.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Mensaje de error del backend: <span className="font-semibold">{failureMessage}</span>
        </p>
        <p className="text-md text-gray-600 mb-6">
          Si el problema persiste, por favor contacta a soporte y proporciona los detalles del error.
        </p>
        <a
          href="/"
          className="w-48 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
        >
          Volver al Inicio
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default WeirdFailurePaymentPage;