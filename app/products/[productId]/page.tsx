import db from "@/clients/db";
import { Product } from "@/schema/product";
import { ProductDetails } from "@/components/products/product-details";
import { Navbar } from "@/components/layout/navbar";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";
import { Review } from "@/schema/review";

interface ProductPageProps {
  params: {
    productId: string;
  }
}

const ProductPage = async ({
  params
}: ProductPageProps) => {
  const { productId } = params;
  const secureUser = await getSecureUser();

  const productSnapshot = await db.collection("products").doc(productId).get();

  if (!productSnapshot.exists) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <p className="text-gray-600 mt-2">El producto que estás buscando no existe o ha sido eliminado</p>
        <a
          href="/"
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver al inicio
        </a>
      </div>
    )
  }

  const data = productSnapshot.data();

  if (!data) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Error al cargar el producto</h1>
        <p className="text-gray-600 mt-2">Ocurrió un problema al intentar cargar el producto. Por favor, inténtalo de nuevo más tarde.</p>
        <a
          href="/"
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver al inicio
        </a>
      </div>
    )
  }

  const product: Product = {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    pictureUrls: data.pictureUrls,
    stock: data.stock,
    category: data.category,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  }

  const reviewsSnapshot = await db
    .collection("reviews")
    .where("productId", "==", productId)
    .get()

  const reviews: Review[] =reviewsSnapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        productId: data.productId,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      }
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());


  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar
        user={secureUser}
      />
      <ProductDetails
        product={product}
        user={secureUser}
        reviews={reviews}
        bucketUrl={process.env.BUCKET_URL!}
      />
    </div>
  )
}

export default ProductPage;
