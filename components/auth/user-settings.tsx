"use client";
import { FaUser, FaSignInAlt, FaUserPlus } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const UserSettings = () => {
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
          onSelect={() => console.log("Abriendo pagina de inicio de sesion")}
        >
          <FaSignInAlt className="mr-2 h-6 w-6 text-gray-800" />
          <span className="text-gray-800 text-lg" >Iniciar Sesion</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => console.log("Abriendo pagina de registro")}
        >
          <FaUserPlus className="mr-2 h-6 w-6 text-gray-800" />
          <span className="text-gray-800 text-lg" >¡Regístrate Gratis!</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
