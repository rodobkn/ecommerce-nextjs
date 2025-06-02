import { Logo } from "@/components/layout/navbar-components/logo";
import { SearchBar } from "@/components/layout/navbar-components/search-bar";
import { UserSettings } from "@/components/auth/user-settings";
import { SecureUser } from "@/schema/user";
import { CartIcon } from "@/components/layout/navbar-components/cart-icon";

interface NavbarProps {
  user: SecureUser | null;
}

export const Navbar = ({
  user
}: NavbarProps) => {
  return (
    <nav className="w-full bg-[#0f1111] text-white">

      {/* Diseño responsivo para pantallas pequeñas (menos de md) */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between px-2 py-3">
          <Logo />
          <div className="flex items-center space-x-4">
            {user && <CartIcon user={user} />}
            <UserSettings user={user} />
          </div>
        </div>
        <div className="px-2 pb-3">
          <SearchBar smallScreen={true} />
        </div>
      </div>

      {/* Diseño regular para pantallas medianas y grandes (md para arriba) */}
      <div className="hidden md:flex items-center justify-between px-4 py-3">
        <Logo />
        <SearchBar />
        <div className="flex items-center space-x-4">
          {user && <CartIcon user={user} />}
          <UserSettings user={user} />
        </div>
      </div>

    </nav>
  )
}