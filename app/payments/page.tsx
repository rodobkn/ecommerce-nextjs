import db from "@/clients/db";
import { redirect } from 'next/navigation';
import { PaymentInterface } from "@/schema/payment";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";

const UserPaymentsPage = async () => {
  const secureUser = await getSecureUser();

  // Validar si el usuario está autenticado
  if (!secureUser) {
    return redirect('/');
  }

  // Consultar los pagos del usuario desde Firestore
  const paymentsSnapshot = await db
    .collection("payments")
    .where("userId", "==", secureUser.id)
    .get();

  // Filtrar los pagos con detalles de Transbank o MercadoPago
  const payments: PaymentInterface[] = paymentsSnapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as PaymentInterface;
    })
    .filter((payment) => payment.paymentDetails?.transbank || payment.paymentDetails?.mercadoPago)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar user={secureUser} />

      {/* Contenido principal */}
      <div className="flex-grow max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Pagos</h1>

        {payments.length === 0 ? (
          <p className="text-lg text-gray-700">
            No se encontraron pagos asociados a tu cuenta.
          </p>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white shadow rounded-lg p-4 border border-gray-200"
              >
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Pago #{payment.id}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Fecha: {payment.createdAt.toLocaleDateString()}{" "}
                    {payment.createdAt.toLocaleTimeString()}
                  </p>
                </div>

                <p className="text-gray-700">
                  <span className="font-semibold">Estado: </span>
                  {payment.paymentDetails.isConfirmed ? (
                    <span className="text-green-600 font-bold">Confirmado</span>
                  ) : (
                    <span className="text-red-600 font-bold">No confirmado</span>
                  )}
                </p>

                <p className="text-gray-700">
                  <span className="font-semibold">Monto Total: </span>
                  {new Intl.NumberFormat("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  }).format(payment.totalAmount)}
                </p>

                <p className="text-gray-700">
                  <span className="font-semibold">Dirección de Envío: </span>
                  {payment.shippingAddress}
                </p>

                <p className="text-gray-700">
                  <span className="font-semibold">Método de Pago: </span>
                  {payment.paymentDetails?.transbank
                    ? "Transbank"
                    : "Mercado Pago"}
                </p>

                <p className="text-gray-700">
                  <span className="font-semibold">Transacción: </span>
                  {payment.paymentDetails?.transbank?.status || 
                    payment.paymentDetails?.mercadoPago?.status || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserPaymentsPage;