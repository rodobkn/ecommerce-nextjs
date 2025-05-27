"use client";

import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";

export const LoginForm = () => {

  return (
    <AuthCardWrapper
      headerLabel="♻️ My Ecommerce"
      headerDescription="Iniciar Sesion"
      switchButtonLabel="¿No tienes cuenta?"
      switchButtonHref="/auth/register"
      showSocial={true}
    >
      <div>Children Login Placeholder</div>
    </AuthCardWrapper>
  )

}