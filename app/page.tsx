import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturedProducts } from  "@/components/landing/featured-products";
import { Footer } from "@/components/layout/footer";
import db from "@/clients/db";
import { Product } from "@/schema/product";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";

export default async function Home() {
  const secureUser = await getSecureUser();

  const productsSnapshot = await db.collection("products").get();
  const products: Product[] = productsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      price: data.price,
      pictureUrls: data.pictureUrls,
      stock: data.stock,
      category: data.category,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Product;
  })

  return (
    <div>
      <Navbar
        user={secureUser}
      />
      <HeroSection />
      <FeaturedProducts
        products={products}
        bucketUrl={process.env.BUCKET_URL!}
      />
      <Footer />
    </div>
  );
}
