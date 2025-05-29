import { Logo } from "@/components/layout/navbar-components/logo";
import { UserSettings } from "@/components/auth/user-settings";
import { SecureUser } from "@/schema/user";

interface NavbarProps {
  user: SecureUser | null;
}

export const Navbar = ({
  user
}: NavbarProps) => {
  return (
    <nav className="w-full bg-[#0f1111] text-white">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <UserSettings user={user} />
      </div>
    </nav>
  )
}