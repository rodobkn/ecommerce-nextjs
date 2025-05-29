"use client";
import { FaUser, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { 
  CreditCard,
  ShoppingBag,
 } from "lucide-react";
 import { useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/components/auth/logout-button";
import { redirectToRegister } from "@/actions/redirects/redirect-to-register";
import { redirectToLogin } from "@/actions/redirects/redirect-to-login";
import { SecureUser } from "@/schema/user";

interface UserSettingsProps {
  user: SecureUser | null;
}

export const UserSettings = ({
  user
}: UserSettingsProps) => {
  const [isRegisterRedirectionPending, startRegisterRedirectionTransition] = useTransition();
  const [isLoginRedirectionPending, startLoginRedirectionTransition] = useTransition();

  const handleRegisterRedirection = () => {
    startRegisterRedirectionTransition(() => {
      redirectToRegister();
    })
  }

  const handleLoginRedirection = () => {
    startLoginRedirectionTransition(() => {
      redirectToLogin();
    })
  }

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer bg-white text-black hover:bg-gray-200"
            aria-label="Abrir menu de usuario"
          >
            <FaUser className="text-xl" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onSelect={handleLoginRedirection}
            disabled={isLoginRedirectionPending}
          >
            <FaSignInAlt className="mr-2 h-6 w-6 text-gray-800" />
            <span className="text-gray-800 text-lg" >Iniciar Sesion</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={handleRegisterRedirection}
            disabled={isRegisterRedirectionPending}
          >
            <FaUserPlus className="mr-2 h-6 w-6 text-gray-800" />
            <span className="text-gray-800 text-lg" >¡Regístrate Gratis!</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer bg-green-950 text-white hover:bg-green-900"
          aria-label="Abrir menu de usuario"
        >
          <FaUser className="text-xl" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <div className="text-xs text-muted-foreground px-2 pb-1 truncate">
          {user.email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => console.log("redireccionando a la pagina de órdenes")}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>Mis Órdenes</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => console.log("redireccionando a la pagina de pagos")}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Mis Pagos</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
