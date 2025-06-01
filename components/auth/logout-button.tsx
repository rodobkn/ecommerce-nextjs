"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth/logout";
import { redirectToLanding } from "@/actions/redirects/redirect-to-landing";
import { useSearchStore } from "@/stores/search-store";

export const LogoutButton = () => {
  const [isPending, startTransition] = useTransition();

  const onLogout = () => {
    startTransition(async () => {
      await logout();
      useSearchStore.getState().reset();
      redirectToLanding();
    })
  }

  return (
    <DropdownMenuItem
      onSelect={onLogout}
      disabled={isPending}
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>{isPending ? "Cerrando sesión..." : "Cerrar Sesión" }</span>
    </DropdownMenuItem>
  )

}
