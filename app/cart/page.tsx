import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";
import { CartsItems } from "@/components/cart/cart-items";

const CartPage = async () => {
  const secureUser = await getSecureUser();

  if (!secureUser) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <Navbar
        user={secureUser}
      />
      <div className="flex-grow">
        <CartsItems
          user={secureUser}
          bucketUrl={process.env.BUCKET_URL!}
        />
      </div>
      <Footer />
    </div>
  )
}

export default CartPage;
