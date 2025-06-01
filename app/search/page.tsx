import { Navbar } from "@/components/layout/navbar";
import { SearchClientComponent } from "@/components/search/search-client-component";
import { Footer } from "@/components/layout/footer";
import { getSecureUser } from "@/utils/server/auth/get-secure-user";

const SearchPage = async () => {
  const secureUser = await getSecureUser();

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <Navbar
        user={secureUser}
      />
      <div className="flex-grow">
        <SearchClientComponent
          bucketUrl={process.env.BUCKET_URL!}
        />
      </div>
      <Footer />
    </div>
  );

}

export default SearchPage;
