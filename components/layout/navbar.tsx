import { Logo } from "@/components/layout/navbar-components/logo";
import { UserSettings } from "@/components/auth/user-settings";

export const Navbar = () => {
  return (
    <nav className="w-full bg-[#0f1111] text-white">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <UserSettings />
      </div>
    </nav>
  )
}