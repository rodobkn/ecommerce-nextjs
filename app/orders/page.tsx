import db from "@/clients/db";
import { redirect } from "next/navigation";
import { Order, OrderStatus } from "@/schema/order";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";
import { CheckCircle, Truck, Package, Boxes } from "lucide-react";

const UserOrdersPage = async () => {
  const secureUser = await getSecureUser();

  // Validar si el usuario está autenticado
  if (!secureUser) {
    return redirect("/");
  }

  // Consultar las órdenes del usuario desde Firestore
  const ordersSnapshot = await db
    .collection("orders")
    .where("userId", "==", secureUser.id)
    .get();

  const orders: Order[] = ordersSnapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Order;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar user={secureUser} />

      {/* Contenido principal */}
      <div className="flex-grow max-w-7xl w-full p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Órdenes</h1>

        {orders.length === 0 ? (
          <p className="text-lg text-gray-700">
            No se encontraron órdenes asociadas a tu cuenta.
          </p>
        ) : (
          <div className="space-y-6 w-full">
            {orders.map((order) => (
              <div
                key={order.id}
                className="w-full bg-white shadow rounded-lg p-6 border border-gray-200"
              >
                {/* Información de la orden */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Orden #{order.id}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Fecha: {order.createdAt.toLocaleDateString()}{" "}
                    {order.createdAt.toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total:{" "}
                    <span className="font-semibold text-gray-800">
                      {new Intl.NumberFormat("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      }).format(
                        order.purchasedCart.reduce(
                          (total, item) => total + item.subtotal,
                          0
                        )
                      )}
                      {" "}CLP
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    ID de Pago: <span className="font-semibold">{order.paymentId}</span>
                  </p>
                </div>

                {/* Estados de la orden */}
                <div className="w-full flex justify-between items-center border-t border-b border-gray-200 py-4 md:px-10">
                  {[
                    { status: OrderStatus.RECEIVED, icon: <Package />, label: "Recibida" },
                    { status: OrderStatus.PROCESSING, icon: <Boxes />, label: "En proceso" },
                    { status: OrderStatus.DISPATCHED, icon: <Truck />, label: "Despachada" },
                    { status: OrderStatus.DELIVERED, icon: <CheckCircle />, label: "Entregada" },
                  ].map(({ status, icon, label }) => (
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          order.status === status
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {icon}
                      </div>
                      <span
                        className={`text-sm mt-2 ${
                          order.status === status ? "text-blue-600 font-semibold" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Productos de la orden */}
                <div className="mt-4">
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Productos:
                  </p>
                  <div className="space-y-3">
                    {order.purchasedCart.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-4">
                        <img
                          src={`${process.env.BUCKET_URL}/${item.product.pictureUrls?.[0]}`}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-md border"
                        />
                        <span className="text-gray-700">{item.product.name} (x{item.quantity})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dirección de envío */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Dirección de Envío: </span>
                    {order.shippingAddress}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UserOrdersPage;